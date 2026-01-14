import React from 'react';

export function Table({ columns, data, renderRow, className = '' }) {
  return (
    <div className={`flex flex-1 flex-col bg-white p-5 mb-5 mx-0 gap-2.5 rounded-md border border-solid border-[#E5E5EA] ${className}`}>
      <div className="flex items-start self-stretch bg-[#7676801C] py-2.5 px-5 rounded-[5px]">
        {columns.map((col, idx) => (
          <div key={idx} className={col.className || 'flex flex-1 items-start gap-0.5'}>
            <span className="text-black text-base">{col.label}</span>
            {col.sortable && (
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/aqpmue1p_expires_30_days.png"
                className="w-6 h-6 object-fill"
                alt="Sort"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col self-stretch gap-2.5">
        {data.map((row, idx) => (
          <div key={idx}>{renderRow(row, idx)}</div>
        ))}
      </div>
    </div>
  );
}
