import React from "react"
import '../CSS/Pagin.css'
import { Link } from "react-router-dom"

const Pagin = ({ page, postsPerPage, TotalPosts, currentPage }) => {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(TotalPosts / postsPerPage); i++) {
        pageNumbers.push(i)
    }
    const scroll = document.getElementById("header");
    let windowInnerWidth = document.documentElement.clientWidth
    let wp
    if(Math.trunc(windowInnerWidth/90)>9){
        wp = 9
    }else{
        wp = Math.trunc(windowInnerWidth/90)
    }
    
    // let pr;
    // let ne;
    let prd;
    let ned;
    let first;
    let last;
    let pageNum = parseInt(currentPage)
    let pageCutLow = pageNum - wp;
    let pageCutHigh = currentPage + wp;
  
    if (currentPage > 1) {
        first = <li className="pag"><Link to={`/${page}/1`} className="pag" onClick={() => { scroll.scrollIntoView({behavior: "smooth"})}}>First</Link></li>;
    }
    // if (currentPage > 1) {
    //     pr = <li className="pag"><Link to={`/${page}/${currentPage - 1}`} className="pag" onClick={() => { scroll.scrollIntoView({behavior: "smooth"})}}>Previous</Link></li>;
    // }
    if (pageCutLow >= 1) {
        prd = <li className="pag"><Link to={`/${page}/${currentPage - (wp-1)}`} className="pag" onClick={() => { scroll.scrollIntoView({behavior: "smooth"})}}>{"<"}</Link></li>;
    }
    // if (currentPage < pageNumbers.length) {
    //     ne = <li className="pag"><Link to={`/${page}/${currentPage + 1}`} className="pag" onClick={() => { scroll.scrollIntoView({behavior: "smooth"})}}>Next</Link></li>;
    // }
    if (pageCutHigh <= pageNumbers.length) {
        ned = <li className="pag"><Link to={`/${page}/${currentPage + (wp-1)}`} className="pag" onClick={() => { scroll.scrollIntoView({behavior: "smooth"})}}>{">"}</Link></li>;
    }
    if (currentPage < pageNumbers.length) {
        last = <li className="pag"><Link to={`/${page}/${pageNumbers.length}`} className="pag" onClick={() => { scroll.scrollIntoView({behavior: "smooth"})}}>{"Last"}</Link></li>;
    }
    
    return (
        <nav className="pag nav">
            <ul className="pag">
                {first}
                {prd}
                {/* {pr} */}
                {pageNumbers.filter(num => num > pageCutLow + 1 && num < pageCutHigh - 1).map(num => (
                    <li key={num} className={currentPage === num ? "active pag" : "pag"}>
                        <Link to={`/${page}/${num}`} onClick={() => { scroll.scrollIntoView({behavior: "smooth"})}}>{num}</Link>
                    </li>
                ))}
                {/* {ne} */}
                {ned}
                {last}
            </ul>
        </nav >
    )
}

export default Pagin