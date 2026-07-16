import LearningLayout from '../../../layouts/LearningLayout'

const assignedTrainings = [
  { id: 1, course: 'UI/UX Advanced Principles', assignedBy: 'HR Team', dueDate: '30 Jun 2026', action: 'Resume' },
  { id: 2, course: 'UI/UX Advanced Principles', assignedBy: 'CEO', dueDate: '15 Jul 2026', action: 'Start Learning' },
  { id: 3, course: 'UI/UX Advanced Principles', assignedBy: 'Team Lead', dueDate: '15 Jul 2026', action: 'Start Learning' },
  { id: 4, course: 'UI/UX Advanced Principles', assignedBy: 'HR Team', dueDate: '15 Jul 2026', action: 'Start Learning' },
]

const inProcessCourses = [
  { id: 1, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical', progress: 78 },
  { id: 2, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical', progress: 78 },
  { id: 3, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical', progress: 78 },
]

const wishlistCourses = [
  { id: 1, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical' },
  { id: 2, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical' },
  { id: 3, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical' },
]

const completedCourses = [
  { id: 1, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical', completedAt: '13 Jun 2026' },
  { id: 2, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical', completedAt: '13 Jun 2026' },
  { id: 3, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical', completedAt: '13 Jun 2026' },
]

const exploreCourses = [
  { id: 1, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical' },
  { id: 2, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical' },
  { id: 3, course: 'UI/UX Advanced Principles', duration: '4h 30m', category: 'Technical' },
]

// Shared button styles so every action button on this page reads as one family.
const BUTTON_BASE = 'rounded-full bg-[#2563eb] font-semibold text-white transition hover:bg-[#1d4ed8]'
const BUTTON_SM = `${BUTTON_BASE} px-3 py-1 text-[12px]`
const BUTTON_HERO = `${BUTTON_BASE} w-full px-6 py-3.5 text-sm`

export default function MyLearning() {
  return (
    <LearningLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-black text-[#111827]">My Learning</h1>
          <p className="text-sm text-[#6b7280] mt-1">Your personal learning journey</p>
        </div>

        <section className="rounded-[24px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-[#eef2f7]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="text-sm uppercase tracking-[0.2em] text-[#2563eb] font-semibold">Continue Learning</div>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="h-28 w-full max-w-[260px] overflow-hidden rounded-[18px] bg-slate-100">
                  <img src="/images/course.png" alt="Course" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="text-base font-semibold text-[#111827]">UI/UX Advanced Principles</div>
                  <div className="text-sm text-[#6b7280]">78% Complete</div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#eef6ff]">
                    <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: '78%' }} />
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2 mt-2">
                    <div className="rounded-[16px] bg-[#f8fafc] p-6">
                      <div className="text-[11px] font-medium text-[#6b7280] mb-3 uppercase tracking-wide">Module</div>
                      <div className="font-bold text-lg whitespace-nowrap">Module 8 of 19</div>
                    </div>
                    <div className="rounded-[16px] bg-[#f8fafc] p-6">
                      <div className="text-[11px] font-medium text-[#6b7280] mb-3 uppercase tracking-wide">Last Accessed</div>
                      <div className="font-bold text-lg whitespace-nowrap">13 Jun 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:w-[280px]">
              <div className="rounded-[18px] bg-[#eff6ff] p-4 flex flex-col justify-center">
                <div className="text-[12px] uppercase tracking-[0.22em] text-[#2563eb] font-semibold">Next up</div>
                <div className="mt-2 text-sm font-semibold text-[#111827]">Module 9: Prototyping best practices</div>
              </div>
              <button className={BUTTON_SM}>Resume Learning</button>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-[#eef2f7]">
          <div className="text-sm uppercase tracking-[0.2em] text-[#111827] font-semibold mb-4">Assigned Trainings</div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-[#6b7280]">
                  <th className="pb-3">Training</th>
                  <th className="pb-3">Assigned By</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedTrainings.map((item) => (
                  <tr key={item.id} className="rounded-[18px] bg-[#f8fafc]">
                    <td className="py-4 pr-4 font-semibold text-[#111827]">{item.course}</td>
                    <td className="py-4 pr-4 text-[#6b7280]">{item.assignedBy}</td>
                    <td className="py-4 pr-4 text-[#6b7280]">{item.dueDate}</td>
                    <td className="py-4">
                      <button className={BUTTON_SM}>{item.action}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4 rounded-[24px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-[#eef2f7]">
            <div className="text-sm uppercase tracking-[0.2em] text-[#111827] font-semibold">In Process Courses</div>
            <div className="space-y-4">
              {inProcessCourses.map((item) => (
                <div key={item.id} className="rounded-[18px] bg-[#f8fafc] p-4">
                  <div className="flex items-center gap-4">
                    <img src="/images/figma.png" alt={item.course} className="h-14 w-14 rounded-2xl object-cover" />
                    <div>
                      <div className="font-semibold text-[#111827]">{item.course}</div>
                      <div className="text-[13px] text-[#6b7280]">{item.duration} | {item.category}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
                    <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${item.progress}%` }} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="text-xs text-[#6b7280]">Last accessed: 13 Jun 2026</span>
                    <button className={BUTTON_SM}>Resume</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-[#eef2f7]">
            <div className="text-sm uppercase tracking-[0.2em] text-[#111827] font-semibold">Your Wishlist</div>
            <div className="grid gap-4">
              {wishlistCourses.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-[18px] bg-[#f8fafc] p-4">
                  <img src="/images/figma.png" alt={item.course} className="h-14 w-14 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#111827]">{item.course}</div>
                    <div className="text-[13px] text-[#6b7280]">{item.duration} | {item.category}</div>
                  </div>
                  <button className={BUTTON_SM}>Enroll</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4 rounded-[24px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-[#eef2f7]">
            <div className="text-sm uppercase tracking-[0.2em] text-[#111827] font-semibold">Completed Course</div>
            <div className="space-y-4">
              {completedCourses.map((item) => (
                <div key={item.id} className="rounded-[18px] bg-[#f8fafc] p-4">
                  <div className="flex items-center gap-4">
                    <img src="/images/figma.png" alt={item.course} className="h-14 w-14 rounded-2xl object-cover" />
                    <div>
                      <div className="font-semibold text-[#111827]">{item.course}</div>
                      <div className="text-[13px] text-[#6b7280]">{item.duration} | {item.category}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
                    <div className="h-full rounded-full bg-[#22c55e]" style={{ width: '100%' }} />
                  </div>
                  <div className="mt-3 text-xs text-[#6b7280]">Completed on: {item.completedAt}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-[#eef2f7]">
            <div className="text-sm uppercase tracking-[0.2em] text-[#111827] font-semibold">Explore More Courses</div>
            <div className="grid gap-4">
              {exploreCourses.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-[18px] bg-[#f8fafc] p-4">
                  <img src="/images/figma.png" alt={item.course} className="h-14 w-14 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#111827]">{item.course}</div>
                    <div className="text-[13px] text-[#6b7280]">{item.duration} | {item.category}</div>
                  </div>
                  <button className={BUTTON_SM}>Enroll</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LearningLayout>
  )
}