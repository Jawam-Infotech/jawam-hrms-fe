import { useState } from 'react'
import { createPortal } from 'react-dom'

import { formatLeaveDate } from '../../utils/leaveUtils.js'


const CONFLICT_LEVELS = {
  low: {
    label: 'No Conflict',
    circleClass: 'bg-[#22c55e]',
  },

  medium: {
    label: 'Moderate Conflict',
    circleClass: 'bg-[#eab308]',
  },

  high: {
    label: 'High Conflict',
    circleClass: 'bg-[#f97316]',
  },

  critical: {
    label: 'Critical Conflict',
    circleClass: 'bg-[#ef4444]',
  },
}


function LeaveConflictIndicator({
  conflicts = [],
}) {
  const [
    activeConflict,
    setActiveConflict,
  ] = useState(null)


  /*
   * =========================
   * SHOW TOOLTIP
   * =========================
   */

  const showTooltip = (
    index,
    conflict,
    config,
    target,
  ) => {
    if (!target) {
      return
    }

    const rect =
      target.getBoundingClientRect()

    setActiveConflict({
      index,
      conflict,
      config,
      rect: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      },
    })
  }


  /*
   * =========================
   * HIDE TOOLTIP
   * =========================
   */

  const hideTooltip = () => {
    setActiveConflict(null)
  }


  /*
   * =========================
   * TOGGLE TOOLTIP
   * =========================
   */

  const toggleTooltip = (
    index,
    conflict,
    config,
    target,
  ) => {
    const isActive =
      activeConflict?.index === index

    if (isActive) {
      hideTooltip()
      return
    }

    showTooltip(
      index,
      conflict,
      config,
      target,
    )
  }


  /*
   * =========================
   * EMPTY STATE
   * =========================
   */

  if (!Array.isArray(conflicts)) {
    return null
  }


  return (
    <div>

      <p className="mb-2 text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
        Leave Conflict Indicator
      </p>


      {conflicts.length === 0 ? (
        <p className="text-[13px] text-[#6b7280]">
          No conflict data available.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">

          {conflicts.map(
            (conflict, index) => {
              const config =
                CONFLICT_LEVELS[
                  conflict?.level
                ] ||
                CONFLICT_LEVELS.low

              const isActive =
                activeConflict?.index ===
                index

              const conflictDate =
                formatLeaveDate(
                  conflict?.date,
                )

              return (
                <button
                  key={
                    `${conflict?.date || 'unknown'}-${index}`
                  }
                  type="button"
                  aria-label={`${conflictDate}: ${config.label}`}
                  aria-expanded={
                    isActive
                  }
                  aria-describedby={
                    isActive
                      ? 'leave-conflict-tooltip'
                      : undefined
                  }
                  onClick={(event) =>
                    toggleTooltip(
                      index,
                      conflict,
                      config,
                      event.currentTarget,
                    )
                  }
                  onMouseEnter={(
                    event,
                  ) =>
                    showTooltip(
                      index,
                      conflict,
                      config,
                      event.currentTarget,
                    )
                  }
                  onMouseLeave={
                    hideTooltip
                  }
                  onFocus={(event) =>
                    showTooltip(
                      index,
                      conflict,
                      config,
                      event.currentTarget,
                    )
                  }
                  onBlur={
                    hideTooltip
                  }
                  className={`h-4 w-4 rounded-full ${config.circleClass} ring-offset-2 transition focus:outline-none focus:ring-2 focus:ring-[#2563eb]`}
                />
              )
            },
          )}

        </div>
      )}


      {/* TOOLTIP */}

      {activeConflict &&
        createPortal(
          <div
            id="leave-conflict-tooltip"
            role="tooltip"
            style={{
              left:
                activeConflict.rect.left +
                activeConflict.rect.width /
                  2,

              top:
                activeConflict.rect.top -
                8,
            }}
            className="pointer-events-none fixed z-[70] w-52 -translate-x-1/2 -translate-y-full rounded-xl bg-[#111827] px-3 py-2.5 text-[12px] leading-5 text-white shadow-lg"
          >

            <p className="font-bold">
              {formatLeaveDate(
                activeConflict.conflict
                  ?.date,
              )}
            </p>

            <p>
              {activeConflict.conflict
                ?.employeesOnLeave ?? 0}{' '}
              Employees on Leave
            </p>

            <p>
              {activeConflict.config
                ?.label || 'Unknown'}
            </p>

          </div>,
          document.body,
        )}

    </div>
  )
}


export default LeaveConflictIndicator