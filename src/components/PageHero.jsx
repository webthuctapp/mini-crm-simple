export default function PageHero({ icon, title, subtitle, color = 'blue', children }) {
  return (
    <div className={'hero ' + color}>
      <div className="hero-main">
        <div className="hero-icon">{icon}</div>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children && <div className="hero-extra">{children}</div>}
    </div>
  )
}
