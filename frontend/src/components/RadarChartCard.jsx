import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export default function RadarChartCard({ math, science, english, computer }) {
  const data = [
    { subject: 'MATH',  value: math },
    { subject: 'SCI',   value: science },
    { subject: 'ENG',   value: english },
    { subject: 'COMP',  value: computer },
  ]

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6 flex flex-col">
      <h3 className="text-sm font-semibold text-on-surface mb-4">Competency Profile</h3>
      <div className="flex-1 min-h-[160px] sm:min-h-[180px]">
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart data={data}>
            <PolarGrid stroke="#434655" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#c3c6d7', fontSize: 11 }} />
            <Radar name="Grade" dataKey="value" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} strokeWidth={1.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
