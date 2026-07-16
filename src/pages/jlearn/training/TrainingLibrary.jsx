import LearningLayout from '../../../layouts/LearningLayout'

const filters = ['All', 'Technical', 'Soft Skills', 'Leadership', 'Compliance', 'AI & Technology', 'HR Policies']

const featuredTraining = {
  title: 'AI Productivity with ChatGPT',
  description: 'Learn how to leverage ChatGPT and AI tools to boost your daily productivity and efficiency.',
  duration: '4h 30m',
  level: 'Beginner',
  language: 'English',
  technology: 'AI & Technology',
}

const courseCards = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: 'UI/UX Advanced Principles',
  duration: '4h 30m',
  category: 'Technical',
  status: index % 3 === 0 ? 'Enrolled' : index % 3 === 1 ? 'Assigned' : 'Complete',
  progress: index % 3 === 0 ? 78 : index % 3 === 1 ? 26 : 100,
  lastAccessed: '13 Jun 2026',
}))

export default function TrainingLibrary() {
  return (
    <LearningLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-black text-[#111827]">Training Library</h1>
          <p className="text-sm text-[#6b7280] mt-1">Discover and explore learning opportunities</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-full bg-white p-4 shadow-sm border border-[#eef2f7]">
          {filters.map((filter) => (
            <button
              key={filter}
              className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-4 py-2 text-sm text-[#111827] transition hover:bg-[#eef6ff]"
            >
              {filter}
            </button>
          ))}
        </div>

        <section className="rounded-[24px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-[#eef2f7]">
          <div className="text-sm uppercase tracking-[0.22em] text-[#111827] font-semibold mb-4">Featured Training</div>
          <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
            <div className="overflow-hidden rounded-[24px] bg-slate-100">
              <img src="/images/course.png" alt="Featured Training" className="h-full w-full object-cover" />
            </div>
            <div className="space-y-5">
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-[#2563eb] font-semibold">Featured Training</div>
                <div className="mt-3 text-2xl font-bold text-[#111827]">{featuredTraining.title}</div>
                <div className="mt-3 text-sm text-[#6b7280] leading-6">{featuredTraining.description}</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6b7280]">Duration</div>
                  <div className="mt-2 font-semibold text-[#111827]">{featuredTraining.duration}</div>
                </div>
                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6b7280]">Level</div>
                  <div className="mt-2 font-semibold text-[#111827]">{featuredTraining.level}</div>
                </div>
                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6b7280]">Language</div>
                  <div className="mt-2 font-semibold text-[#111827]">{featuredTraining.language}</div>
                </div>
                <div className="rounded-[18px] bg-[#f8fafc] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6b7280]">Technology</div>
                  <div className="mt-2 font-semibold text-[#111827]">{featuredTraining.technology}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-full bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8]">
                  Enroll Course
                </button>
                <button className="rounded-full border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-[#374151] hover:bg-[#f8fafc]">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-[#eef2f7]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">All Training (120)</h2>
              <p className="text-sm text-[#6b7280]">Browse all available courses in one place.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courseCards.map((course) => (
              <div key={course.id} className="rounded-[24px] bg-[#f8fafc] p-4 shadow-sm border border-[#eef2f7]">
                <div className="overflow-hidden rounded-[20px] bg-slate-100">
                  <img src="/images/course.png" alt={course.title} className="h-44 w-full object-cover" />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2563eb] shadow-sm">{course.status}</span>
                  <span className="text-xs text-[#6b7280]">{course.progress}%</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="font-semibold text-[#111827]">{course.title}</div>
                  <div className="text-[13px] text-[#6b7280]">{course.duration} | {course.category}</div>
                  <div className="text-[12px] text-[#6b7280]">Last accessed: {course.lastAccessed}</div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e2e8f0]">
                  <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${course.progress}%` }} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {course.status === 'Enrolled' && (
                    <button className="col-span-2 rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
                      Resume Course
                    </button>
                  )}
                  {course.status === 'Assigned' && (
                    <button className="col-span-2 rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
                      Start Learning
                    </button>
                  )}
                  {course.status === 'Complete' && (
                    <>
                      <button className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#f8fafc]">
                        Add to Wishlist
                      </button>
                      <button className="rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
                        Start Learning
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LearningLayout>
  )
}
