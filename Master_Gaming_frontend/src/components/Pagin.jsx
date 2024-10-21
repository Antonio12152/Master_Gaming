import React from "react";
import '../CSS/Pagin.css';
import { Link } from "react-router-dom";

const Pagin = ({ page, postsPerPage, TotalPosts, currentPage, search, tags, user }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(TotalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    const scroll = document.getElementById("header");
    let windowInnerWidth = document.documentElement.clientWidth;
    let wp = Math.trunc(windowInnerWidth / 90) > 9 ? 9 : Math.trunc(windowInnerWidth / 90);
    
    let prd, ned, first, last;
    let pageNum = parseInt(currentPage);
    let pageCutLow = pageNum - wp;
    let pageCutHigh = pageNum + wp;

    const buildLink = (num) => {
        let query = `?`;
        if(search){
            query += `&search=${search}`;
        }
        if(tags){
            query += `&tags=${tags}`;
        }
        if (user) {
            query += `&user=${user}`;
        }
        query += `&id=${num}`;
        return `/${page}${query}`;
    };

    if (currentPage > 1) {
        first = (
            <li className="pag">
                <Link to={buildLink(1)} className="pag" onClick={() => { scroll.scrollIntoView({ behavior: "smooth" }) }}>First</Link>
            </li>
        );
    }
    if (pageCutLow >= 1) {
        prd = (
            <li className="pag">
                <Link to={buildLink(currentPage - 1)} className="pag" onClick={() => { scroll.scrollIntoView({ behavior: "smooth" }) }}>{"<"}</Link>
            </li>
        );
    }
    if (pageCutHigh <= pageNumbers.length) {
        ned = (
            <li className="pag">
                <Link to={buildLink(currentPage + 1)} className="pag" onClick={() => { scroll.scrollIntoView({ behavior: "smooth" }) }}>{">"}</Link>
            </li>
        );
    }
    if (currentPage < pageNumbers.length) {
        last = (
            <li className="pag">
                <Link to={buildLink(pageNumbers.length)} className="pag" onClick={() => { scroll.scrollIntoView({ behavior: "smooth" }) }}>{"Last"}</Link>
            </li>
        );
    }

    return (
        <nav className="pag nav">
            <ul className="pag">
                {first}
                {prd}
                {pageNumbers.filter(num => num > pageCutLow && num < pageCutHigh).map(num => (
                    <li key={num} className={currentPage === num ? "active pag" : "pag"}>
                        <Link to={buildLink(num)} onClick={() => { scroll.scrollIntoView({ behavior: "smooth" }) }}>{num}</Link>
                    </li>
                ))}
                {ned}
                {last}
            </ul>
        </nav>
    );
}

export default Pagin;
