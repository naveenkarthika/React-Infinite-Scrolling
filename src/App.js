import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";

function App() {
  const clientId = `R3Wi35_ER-rTmckXUATVR9uUBEF4zZ-yR3Ylqwim-TI`;

  const [record, setRecord] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  let observe = useRef(null);

  const handlePhotos = async () => {
    setLoading(true);
    const res = await fetch(
      `https://api.unsplash.com/photos/?client_id=${clientId}&page=${page}&per_page=10`
    );
    const data = await res.json();
    setHasMore(data?.length > 0);
    setRecord((preState) =>
      Array.from(new Set([...preState, ...data].map((a) => a.id))).map((id) => {
        return [...preState, ...data].find((a) => a.id === id);
      })
    );
    setLoading(false);
  };

  const lastCardElement = useCallback(
    (node) => {
      if (loading) return;
      if (observe.current) observe.current.disconnect();
      observe.current = new IntersectionObserver((entries) => {
        const Intersecting = entries[0]?.isIntersecting;
        if (Intersecting && hasMore) {
          setPage((preState) => preState + 1);
        }
      });

      if (node) observe.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    handlePhotos(page);
  }, [page]);

  return (
    <div className="App">
      {record?.length > 0 &&
        record.map((e, i) => {
          if (record.length === i + 1) {
            return (
              <div
                ref={lastCardElement}
                id="lastCard"
                key={e.id}
                className="photo"
              >
                <img className="img" src={e?.urls?.small} alt="" />
                <p>{e?.user?.first_name + "" + e?.user?.last_name}</p>
                <span>Likes: {e?.user?.total_likes}</span>
              </div>
            );
          } else {
            return (
              <div key={e.id} className="photo">
                <img className="img" src={e?.urls?.small} alt="" />
                <p>{e?.user?.first_name + "" + e?.user?.last_name}</p>
                <span>Likes: {e?.user?.total_likes}</span>
              </div>
            );
          }
        })}

      <div className="loading">Loading...</div>
      <h3>{record?.length}</h3>
    </div>
  );
}

export default App;
