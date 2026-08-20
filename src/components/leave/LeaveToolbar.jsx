import {
  LEAVE_SORT_OPTIONS,
  LEAVE_STATUSES,
  LEAVE_TYPES,
} from '../../constants/leave.js'


function LeaveToolbar({
  search = '',
  status = 'All',
  leaveType = 'All',
  sortBy = 'newest',
  onSearchChange,
  onStatusChange,
  onLeaveTypeChange,
  onSortChange,
}) {
  return (
    <section
      aria-label="Leave request filters"
      className="flex flex-col gap-3 rounded-[20px] border border-[#e5e7eb] bg-white p-4 shadow-sm lg:flex-row lg:items-center"
    >

      {/* SEARCH */}

      <div className="min-w-0 flex-1">

        <label
          htmlFor="leave-search"
          className="sr-only"
        >
          Search leave requests
        </label>

        <input
          id="leave-search"
          type="search"
          value={search}
          onChange={(event) =>
            onSearchChange?.(
              event.target.value,
            )
          }
          placeholder="Search employee, leave type, or reason"
          autoComplete="off"
          className="h-11 w-full rounded-xl border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
        />

      </div>


      {/* STATUS */}

      <div>
        <label
          htmlFor="leave-status-filter"
          className="sr-only"
        >
          Filter by status
        </label>

        <select
          id="leave-status-filter"
          value={status}
          onChange={(event) =>
            onStatusChange?.(
              event.target.value,
            )
          }
          className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] text-[#111827] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50 lg:w-auto"
        >
          {LEAVE_STATUSES.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ),
          )}
        </select>

      </div>


      {/* LEAVE TYPE */}

      <div>
        <label
          htmlFor="leave-type-filter"
          className="sr-only"
        >
          Filter by leave type
        </label>

        <select
          id="leave-type-filter"
          value={leaveType}
          onChange={(event) =>
            onLeaveTypeChange?.(
              event.target.value,
            )
          }
          className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] text-[#111827] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50 lg:w-auto"
        >
          {LEAVE_TYPES.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ),
          )}
        </select>

      </div>


      {/* SORT */}

      <div>
        <label
          htmlFor="leave-sort"
          className="sr-only"
        >
          Sort leave requests
        </label>

        <select
          id="leave-sort"
          value={sortBy}
          onChange={(event) =>
            onSortChange?.(
              event.target.value,
            )
          }
          className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] text-[#111827] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50 lg:w-auto"
        >
          {LEAVE_SORT_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ),
          )}
        </select>

      </div>

    </section>
  )
}


export default LeaveToolbar