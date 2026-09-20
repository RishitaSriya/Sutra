import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Check,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Opportunity } from '../../types';
import { clsx } from 'clsx';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, toggleSaveOpportunity, applyOpportunity, setIsMockInterviewOpen, user } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = ['all', 'Internship', 'Hackathon', 'Competition'];

  const filtered =
    selectedType === 'all'
      ? opportunities
      : opportunities.filter((o) => o.type === selectedType);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="forest" size="sm" icon={<Briefcase size={12} />}>
              TIER-2/3/4 FRIENDLY CURATION
            </Badge>
            <span className="text-xs font-bold text-[#E9785A]">
              SKILL-MATCHED TO {user.currentRole.toUpperCase()}
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            Opportunities & Hackathons
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5">
            Real industry internships and national hackathons filtered by your current learning skills.
          </p>
        </div>

        <Button
          onClick={() => setIsMockInterviewOpen(true)}
          className="flex items-center gap-2 bg-[#244B3A] text-white shadow-[3px_3px_0px_#171717] shrink-0"
        >
          <span>🎯</span>
          <span>AI Mock Interview</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-2 select-none',
              selectedType === t
                ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[2px_2px_0px_#171717]'
                : 'bg-[#FAF6EE] text-[#575757] border-[#171717]/30 hover:border-[#171717]'
            )}
          >
            {t === 'all' ? 'All Opportunities' : `${t}s`}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Header with Match Score */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] shadow-[1.5px_1.5px_0px_#171717]">
                    {opp.logo}
                  </span>
                  <div>
                    <span className="text-xs font-display font-bold text-[#575757]">
                      {opp.company}
                    </span>
                    <h3 className="font-display font-bold text-lg text-[#171717] leading-tight">
                      {opp.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-[#E4A93A] text-[#171717] font-display font-black text-xs border border-[#171717] shadow-[1px_1px_0px_#171717]">
                    {opp.matchScore}% Match
                  </span>
                  <span className="text-[10px] text-[#575757] font-semibold mt-0.5">
                    {opp.workType}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#575757] font-medium leading-relaxed">
                {opp.description}
              </p>

              {/* Skills Tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-display font-bold text-[#575757] uppercase tracking-wider">
                  Required Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {opp.skillTags.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-display font-bold px-2.5 py-0.5 rounded-lg bg-[#F7F1E3] border border-[#171717] text-[#171717]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key details bar */}
              <div className="p-3 bg-[#F7F1E3] rounded-2xl border border-[#171717]/30 flex items-center justify-between text-xs font-semibold text-[#171717]">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-[#E9785A]" />
                  <span>{opp.stipendOrPrize}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#575757]">
                  <Calendar size={14} />
                  <span>Deadline: in {opp.daysLeft} days</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-[#171717]/10">
              <button
                onClick={() => toggleSaveOpportunity(opp.id)}
                className="p-2 rounded-xl bg-[#F7F1E3] hover:bg-[#ECE4D0] border-2 border-[#171717] shadow-[1.5px_1.5px_0px_#171717] cursor-pointer"
                title={opp.saved ? 'Saved' : 'Save opportunity'}
              >
                {opp.saved ? <BookmarkCheck size={16} className="text-[#E4A93A]" /> : <Bookmark size={16} />}
              </button>

              <div className="flex items-center gap-2">
                {opp.applied ? (
                  <span className="text-xs font-display font-black text-[#244B3A] flex items-center gap-1 py-2 px-3 bg-[#6F8F72]/20 rounded-xl border border-[#244B3A]">
                    <CheckCircle2 size={15} /> Application Tracked
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ExternalLink size={15} />}
                    iconPosition="right"
                    onClick={() => applyOpportunity(opp.id)}
                  >
                    Apply Now (+50 XP) →
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
