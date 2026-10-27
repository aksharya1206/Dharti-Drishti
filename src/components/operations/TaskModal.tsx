import React, { useState } from 'react';
import { X, Calendar, Clock, Wrench, Sprout, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmTask, TaskPriority, TaskStatus } from '../../types';

interface TaskModalProps {
  task?: FarmTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
  const { farms, resources, addTask, updateTask } = useApp();

  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [farmId, setFarmId] = useState(task?.farmId || farms[0]?.id || 'farm-a');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'Medium');
  const [priorityReason, setPriorityReason] = useState(task?.priorityReason || '');
  const [scheduledDate, setScheduledDate] = useState(task?.scheduledDate || '2026-10-28');
  const [startTime, setStartTime] = useState(task?.startTime || '09:00');
  const [endTime, setEndTime] = useState(task?.endTime || '12:00');
  const [resourceRequiredId, setResourceRequiredId] = useState(
    task?.resourceRequiredId || resources[0]?.id || 'res-pump-1'
  );
  const [assignedTeam, setAssignedTeam] = useState(task?.assignedTeam || 'Field Operations Team Alpha');
  const [notes, setNotes] = useState(task?.notes || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'Scheduled');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Operation title is required.';
    if (!priorityReason.trim()) errs.priorityReason = 'Please specify priority rationale.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedFarm = farms.find(f => f.id === farmId);
    const selectedResource = resources.find(r => r.id === resourceRequiredId);

    const taskPayload = {
      title,
      farmId,
      farmName: selectedFarm ? selectedFarm.name : 'Farm',
      crop: selectedFarm ? selectedFarm.cropType : 'Wheat',
      priority,
      priorityReason,
      status,
      scheduledDate,
      startTime,
      endTime,
      durationHours: 3,
      resourceRequiredId,
      resourceName: selectedResource ? selectedResource.name : 'Equipment',
      assignedTeam,
      notes,
    };

    if (isEditing && task) {
      updateTask({ ...task, ...taskPayload });
    } else {
      addTask(taskPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-agri-border overflow-hidden my-6">
        <div className="bg-forest-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center text-forest-200">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                {isEditing ? 'Edit Farm Operation' : 'Schedule New Farm Activity'}
              </h3>
              <p className="text-[11px] text-forest-200">Coordinate crew and machinery requirements</p>
            </div>
          </div>
          <button onClick={onClose} className="text-forest-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-agri-charcoal mb-1">
              Operation Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Mustard Aphid Bio-Spray or Deep Subsoiling"
              className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
            {errors.title && <p className="text-xs text-agri-red mt-1">{errors.title}</p>}
          </div>

          {/* Farm and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                Target Farm Plot
              </label>
              <select
                value={farmId}
                onChange={e => setFarmId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
              >
                {farms.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.cropType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                Operational Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
              >
                <option value="Critical">Critical (Immediate Outbreak / Window)</option>
                <option value="High">High (Moisture / Nutrition Tension)</option>
                <option value="Medium">Medium (Routine Scheduled)</option>
                <option value="Low">Low (Scouting / Non-urgent)</option>
              </select>
            </div>
          </div>

          {/* Priority Reason */}
          <div>
            <label className="block text-xs font-semibold text-agri-charcoal mb-1">
              Priority Rationale / Logic
            </label>
            <input
              type="text"
              value={priorityReason}
              onChange={e => setPriorityReason(e.target.value)}
              placeholder="e.g. Aphid economic threshold reached; irrigation canal slot expires at 15:00"
              className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
            {errors.priorityReason && (
              <p className="text-xs text-agri-red mt-1">{errors.priorityReason}</p>
            )}
          </div>

          {/* Date and Time Windows */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
            </div>
          </div>

          {/* Required Resource and Assigned Crew */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                Required Equipment / Asset
              </label>
              <select
                value={resourceRequiredId}
                onChange={e => setResourceRequiredId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
              >
                {resources.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                Assigned Team
              </label>
              <select
                value={assignedTeam}
                onChange={e => setAssignedTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
              >
                <option value="Field Operations Team Alpha">Field Operations Team Alpha (4 crew)</option>
                <option value="Field Operations Team Beta">Field Operations Team Beta (3 crew)</option>
                <option value="Rohtak Contract Operator">Rohtak Contract Operator</option>
              </select>
            </div>
          </div>

          {/* Status (if editing) */}
          {isEditing && (
            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                Task Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-agri-charcoal mb-1">
              Operational Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Ensure nozzle pressure is set to 2.5 bar for uniform coverage"
              className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-agri-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-agri-border text-xs font-medium text-agri-charcoal hover:bg-agri-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition-all shadow-sm"
            >
              {isEditing ? 'Save Changes' : 'Schedule Operation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

