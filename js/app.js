import { supabase } from './supabase-client.js'


/**
 * Récupère une catégorie, ses sous-catégories et ses questions par son ID.
 * @param {number} categoryId - L'identifiant unique (ex: 1)
 */
export async function fetchCategoryDataById(categoryId) {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      title,
      description,
      subcategories (
        id,
        name,
        description,
        questions (
          id,
          title,
          author,
          publication_date,
          created_at,
          questions_themes (
            themes (
              nom
            )
          )
        )
      )
    `)
    .eq('id', categoryId)
    .single();

  if (error) {
    console.error("Erreur fetchCategoryDataById:", error);
    return null;
  }
  return data;
}


/**
 * Génère le code HTML et l'injecte dans la page en séparant les questions par sous-catégorie.
 * @param {Object} categoryData - Les données retournées par Supabase
 * @param {string} containerId - L'ID de l'élément HTML cible
 */
export function displayCategoryContent(categoryData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!categoryData || !categoryData.subcategories || categoryData.subcategories.length === 0) {
        container.innerHTML = `<p class="no-data">Aucun contenu disponible pour cette catégorie pour le moment.</p>`;
        return;
    }

    // Génération du HTML pour chaque sous-catégorie et ses questions
    container.innerHTML = categoryData.subcategories.map(sub => {
        
        // Génération des cartes de questions pour cette sous-catégorie
        const questionsHtml = sub.questions && sub.questions.length > 0
            ? sub.questions.map(q => `
                <div class="question-card" id="question-${q.id}">
                    <h3 class="question-title">${q.title}</h3>
                    ${q.content ? `<p class="question-content">${q.content}</p>` : ''}
                    ${q.author ? `<span class="question-author">— ${q.author}</span>` : ''}
                </div>
            `).join('')
            : `<p class="no-questions">Aucune question dans cette sous-catégorie pour le moment.</p>`;

        // Structure HTML d'une section de sous-catégorie
        return `
            <section class="subcategory-section">
                <h2 class="subcategory-title">${sub.name}</h2>
                <div class="questions-grid">
                    ${questionsHtml}
                </div>
            </section>
        `;
    }).join('');
}

/**
 * S'abonne aux modifications en temps réel sur la table des questions.
 * @param {string} categoryTitle - Le titre de la catégorie à recharger
 * @param {string} containerId - L'ID de l'élément HTML cible
 */
export function subscribeToRealtime(categoryTitle, containerId) {
    const channel = supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'questions' },
            async (payload) => {
                console.log('Changement détecté dans la base de données ! Rechargement...', payload);
                // On recharge automatiquement les données fraîches et on met à jour l'interface
                const updatedData = await fetchCategoryData(categoryTitle);
                displayCategoryContent(updatedData, containerId);
            }
        )
        .subscribe();

    return channel;
}

/**
 * Récupère toutes les catégories de la base de données (inclut l'image_url)
 */
export async function fetchAllCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('id, title, description, class_theme, link_url, type, image_url') // Ajout de image_url ici
        .order('id', { ascending: true });

    if (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return [];
    }
    return data;
}

/**
 * Génère le HTML pour afficher les catégories sous forme de cartes cliquables avec leurs images
 * @param {Array} categories - Liste des catégories récupérées
 * @param {string} containerId - L'ID de l'élément HTML cible
 */
export function displayCategoriesGrid(categories, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (categories.length === 0) {
        container.innerHTML = `<p class="no-data">Aucune catégorie disponible pour le moment.</p>`;
        return;
    }

    container.innerHTML = categories.map(cat => {
        // Image par défaut si image_url est vide (NULL) dans la base
        const imageUrl = cat.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop';

        return `
            <a href="${cat.link_url || '#'}" class="category-card ${cat.class_theme || 'default-theme'}">
                <div class="card-image-wrapper">
                    <img src="${imageUrl}" alt="${cat.title}" class="category-img" loading="lazy" />
                </div>
                <div class="category-card-content">
                    <span class="category-type">${cat.type === 'question' ? '🤔 Questionner' : cat.type}</span>
                    <h3 class="category-card-title">${cat.title}</h3>
                    ${cat.description ? `<p class="category-card-description">${cat.description}</p>` : ''}
                </div>
            </a>
        `;
    }).join('');
}

/**
 * Récupère les questions associées à une catégorie spécifique
 * @param {string} categoryId - L'identifiant de la catégorie
 */
export async function fetchQuestionsByCategory(categoryId) {
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category_id', categoryId); // Exemple de filtre

    if (error) {
        console.error('Erreur récupération questions:', error);
        return [];
    }
    return data;
}
