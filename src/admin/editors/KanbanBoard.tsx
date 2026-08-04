import { useState, useRef } from 'react';
import { GripVertical, Mail, Phone, Building2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Lead, SiteData } from '../../data/siteData';
import { PIPELINE_ORDER, stageColor, stageReportLabel } from '../crm/pipeline';

interface Props {
  data: SiteData;
  onSave: (d: SiteData) => void;
  onEditLead?: (leadId: string) => void;
}

export default function KanbanBoard({ data, onSave, onEditLead }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    setDraggedFrom(lead.status);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedLead) return;

    const updatedLeads = data.leads.map(l =>
      l.id === draggedLead.id ? { ...l, status: newStatus } : l
    );
    onSave({ ...data, leads: updatedLeads });
    setDraggedLead(null);
    setDraggedFrom(null);
  };

  const handleDelete = (leadId: string) => {
    if (confirm('Delete this lead?')) {
      onSave({ ...data, leads: data.leads.filter(l => l.id !== leadId) });
    }
  };

  const getSourceBadgeColor = (source?: string) => {
    const colors: Record<string, string> = {
      website: 'bg-blue-100 text-blue-700',
      workshop: 'bg-amber-100 text-amber-700',
      webinar: 'bg-purple-100 text-purple-700',
      email: 'bg-green-100 text-green-700',
      whatsapp: 'bg-emerald-100 text-emerald-700',
      referral: 'bg-pink-100 text-pink-700',
      phone: 'bg-orange-100 text-orange-700',
      direct: 'bg-indigo-100 text-indigo-700',
    };
    return colors[source || 'direct'] || 'bg-gray-100 text-gray-700';
  };

  const getSourceLabel = (source?: string) => {
    if (!source) return 'Direct';
    if (source === 'whatsapp') return 'WhatsApp';
    return source.charAt(0).toUpperCase() + source.slice(1);
  };

  return (
    <div className="space-y-3">
      {/* Scroll Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => scroll('left')}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          title="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="text-xs text-slate-500">Drag to scroll or use arrows →</p>
        <button
          onClick={() => scroll('right')}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          title="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4" ref={scrollContainerRef}>
        <div className="flex gap-4 min-w-full">
        {PIPELINE_ORDER.map(stage => {
          const stageLeads = data.leads.filter(l => l.status === stage);
          const color = stageColor(stage);

          return (
            <div
              key={stage}
              className="flex-shrink-0 w-80 rounded-lg bg-slate-50 border border-slate-200 flex flex-col"
            >
              {/* Stage Header */}
              <div
                className="px-4 py-3 border-b border-slate-200 flex items-center justify-between"
                style={{ backgroundColor: `${color}15`, borderTopColor: color }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold text-slate-900 text-sm">
                    {stageReportLabel(stage)}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded-full">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div
                className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400">No leads</p>
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onClick={() => onEditLead?.(lead.id)}
                      className="bg-white rounded-lg border border-slate-200 p-3 cursor-move hover:shadow-md hover:border-slate-300 transition group"
                    >
                      {/* Card Header */}
                      <div className="flex items-start gap-2 mb-2">
                        <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 truncate">
                            {lead.name}
                          </p>
                          {lead.company && (
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {lead.company}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Source Badge */}
                      <div className="mb-2">
                        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${getSourceBadgeColor(lead.source)}`}>
                          {getSourceLabel(lead.source)}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1 text-xs text-slate-600 mb-2">
                        {lead.email && (
                          <p className="flex items-center gap-2 truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </p>
                        )}
                        {lead.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            {lead.phone}
                          </p>
                        )}
                      </div>

                      {/* Delete Button */}
                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(lead.id);
                          }}
                          className="text-slate-400 hover:text-red-600 transition"
                          title="Delete lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
