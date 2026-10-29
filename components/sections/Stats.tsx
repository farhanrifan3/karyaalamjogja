import { stats } from "@/lib/stats";

export function Stats() {
  return (
    <div className="stats">
      <div className="wrap rv">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
