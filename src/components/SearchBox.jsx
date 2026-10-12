export default function SearchBox({ query, onQuery }) {
  return (
    <label className="search">
      <span className="visually-hidden">Ara</span>
      <input
        type="search"
        placeholder="Kelime, kalıp veya konu ara"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
    </label>
  )
}
