import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Blog.css'

export default function Blog() {
  const navigate = useNavigate();

  // Datos de ejemplo para los blogs - en una app real esto vendría de una API
  const blogPosts = [
    {
      id: 1,
      title: "Las mejores ofertas de gaming para este mes",
      excerpt: "Descubre increíbles descuentos en los videojuegos más populares, desde títulos AAA hasta indies únicos. No te pierdas estas oportunidades limitadas que hemos preparado especialmente para nuestra comunidad gamer.",
      image: "/images/logos/logo\.png",
      slug: "mejores-ofertas-gaming-mes"
    },
    {
      id: 2,
      title: "Guía completa para armar tu primer PC Gamer",
      excerpt: "Todo lo que necesitas saber para construir la configuración perfecta según tu presupuesto. Desde procesadores hasta tarjetas gráficas, te guiamos paso a paso en esta emocionante aventura.",
      image: "/images/logos/logo\.png",
      slug: "guia-armar-primer-pc-gamer"
    },
    {
      id: 3,
      title: "Los lanzamientos más esperados del próximo trimestre",
      excerpt: "Mantente al día con los títulos que están por revolucionar la industria del gaming. Desde secuelas muy esperadas hasta nuevas franquicias que prometen cambiar las reglas del juego.",
      image: "/images/logos/logo\.png",
      slug: "lanzamientos-esperados-trimestre"
    },
    {
      id: 4,
      title: "Consejos para mejorar tu setup gaming",
      excerpt: "Optimiza tu espacio de juego con estos tips profesionales. Desde la iluminación perfecta hasta la ergonomía ideal, convierte tu escritorio en la estación gaming definitiva.",
      image: "/images/logos/logo\.png",
      slug: "consejos-mejorar-setup-gaming"
    }
  ];

  const handleReadMore = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="blog-container">
      <main className="blog-main">
        <h1 className="blog-title">Noticias importantes</h1>
        
        <section className="blog-list">
          {blogPosts.map((post, index) => (
            <div key={post.id} className="articulo">
              <article className="blog-entry">
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <button 
                  onClick={() => handleReadMore(post.slug)}
                  className="btn"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Leer más
                </button>
              </article>
              <img src={post.image} alt={`Imagen de ${post.title}`} />
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}