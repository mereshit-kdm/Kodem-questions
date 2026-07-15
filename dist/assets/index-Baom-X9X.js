import{createClient as e}from"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var t=e(`https://fxyzhmrwipnzuswmowmi.supabase.co`,`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4eXpobXJ3aXBuenVzd21vd21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NDIzNTgsImV4cCI6MjA5OTQxODM1OH0.bbAgLNaxgZCcstbwDCB0mT71aPekumjVgVvU67HIXjM`);async function n(){let{data:e,error:n}=await t.from(`categories`).select(`id, title, description, class_theme, link_url, type, image_url`).order(`id`,{ascending:!0});return n?(console.error(`Erreur lors de la récupération des catégories:`,n),[]):e}var r={"Se questionner sur soi-même":`https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80`,"Se questionner sur le monde":`https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80`,"Se questionner sur l’avenir":`https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80`,"Se questionner sur l’autre":`https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80`,"Se questionner sur l’au-delà":`https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=600&q=80`,"Se questionner sur l’invisible":`https://images.unsplash.com/photo-1516331138075-f3ad16d69762?auto=format&fit=crop&w=600&q=80`,"Se questionner sur les croyances":`https://images.unsplash.com/photo-1548625361-155deee223cb?auto=format&fit=crop&w=600&q=80`},i=document.getElementById(`categories-container`),a=document.getElementById(`search-input`),o=document.getElementById(`search-drawer`),s=document.getElementById(`drawer-overlay`),c=document.getElementById(`close-drawer`),l=document.getElementById(`drawer-content`),u=document.getElementById(`results-count`);document.addEventListener(`DOMContentLoaded`,async()=>{d(await n())});function d(e){if(e.length===0){i.innerHTML=`<p class="loading-text">Aucune catégorie trouvée en base de données.</p>`;return}i.innerHTML=e.map(e=>{let t=e.image_url||r[e.title]||`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80`;return`
                    <a href="${`categorie.html?id=${e.id}`}" class="category-card ${e.class_theme||`default-theme`}">
                        <div class="card-image-wrapper">
                            <img src="${t}" alt="${e.title}">
                        </div>
                        <div class="card-body">
                            <h2>${e.title}</h2>
                            <p>${e.description||``}</p>
                        </div>
                    </a>
                `}).join(``)}function f(){o.classList.add(`open`),s.classList.add(`active`)}function p(){o.classList.remove(`open`),s.classList.remove(`active`)}async function m(e){let n=e.trim();if(n===``){p();return}let{data:r,error:i}=await t.from(`questions`).select(`
                    id,
                    title,
                    content,
                    subcategories (
                        name,
                        categories (
                            id,
                            title
                        )
                    )
                `).or(`title.ilike.%${n}%,content.ilike.%${n}%`);if(i){console.error(`Erreur de recherche :`,i);return}u.textContent=r.length,l.innerHTML=``,r.length===0?l.innerHTML=`
                    <div class="no-results">
                        <p>Aucun mystère ne correspond à votre recherche.</p>
                    </div>
                `:r.forEach(e=>{let t=e.subcategories?.categories?.id,n=e.subcategories?.categories?.title||`Non spécifié`,r=e.subcategories?.name||`Non spécifié`,i=document.createElement(`div`);i.className=`question-card`,i.style.cursor=`pointer`,i.addEventListener(`click`,()=>{t&&(window.location.href=`categorie.html?id=${t}`)}),i.innerHTML=`
                        <div class="question-badges">
                            <span class="q-badge badge-cat">${n}</span>
                            <span class="q-badge badge-subcat">${r}</span>
                        </div>
                        <h4>${e.title}</h4>
                        <p>${e.content||``}</p>
                    `,l.appendChild(i)}),f()}a.addEventListener(`input`,e=>{m(e.target.value)}),c.addEventListener(`click`,p),s.addEventListener(`click`,p),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&p()});