import { supabase } from "./supabase.js";
const { data: { user } } = await supabase.auth.getUser();
if (!user && !location.pathname.endsWith("login.html")) {
  location.href = "/admin/login.html";
} const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { error } = await supabase.auth.signInWithPassword({
      email, password
    });
    if (error) {
      document.getElementById("errorMsg").textContent = error.message;

    } else {
      location.href = "/admin/index.html";
    }
  })
}
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await supabase.auth.signOut(); location.href = "/admin/login.html";
});

/* ===============================
   SKILLS SECTION
================================ */
const skillsContainer = document.getElementById("skillsContainer");
const addSkillBtn = document.getElementById("addSkill");
const saveSkillsBtn = document.getElementById("saveSkills");

function skillRow(skill = {}) {
  const div = document.createElement("div");
  div.className = "repeat-box";
  div.innerHTML = `
    <input placeholder="Skill Name" value="${skill.name || ""}">
    <input placeholder="Icon URL" value="${skill.icon_url || ""}">
    <select>
      ${["Frontend", "Backend", "Database", "Others"]
      .map(c => `<option ${skill.category === c ? "selected" : ""}>${c}</option>`)
      .join("")}
    </select>
    <button class="danger">Delete</button>
  `;

  div.querySelector(".danger").onclick = async () => {
    if (skill.id) {
      await supabase.from("skills").delete().eq("id", skill.id);
    }
    div.remove();
  };

  return div;
}

async function loadSkills() {
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("position");

  skillsContainer.innerHTML = "";
  data?.forEach(s => skillsContainer.appendChild(skillRow(s)));
}

saveSkillsBtn?.addEventListener("click", async () => {
  const rows = [...skillsContainer.children];

  for (let i = 0; i < rows.length; i++) {
    const [name, icon, category] = rows[i].querySelectorAll("input, select");

    await supabase.from("skills").upsert({
      name: name.value,
      icon_url: icon.value,
      category: category.value,
      position: i
    });
  }

  alert("Skills saved");
});

addSkillBtn?.addEventListener("click", () => {
  skillsContainer.appendChild(skillRow());
});

loadSkills();

/* ===============================
   EXPERIENCES SECTION
================================ */
const expContainer = document.getElementById("expContainer");
const addExpBtn = document.getElementById("addExp");
const saveExpBtn = document.getElementById("saveExp");

function expRow(exp = {}) {
  const div = document.createElement("div");
  div.className = "repeat-box";
  div.innerHTML = `
    <input placeholder="Title" value="${exp.title || ""}">
    <input placeholder="Year" value="${exp.year || ""}">
    <textarea rows="3">${exp.description || ""}</textarea>
    <button class="danger">Delete</button>
  `;

  div.querySelector(".danger").onclick = async () => {
    if (exp.id) {
      await supabase.from("experiences").delete().eq("id", exp.id);
    }
    div.remove();
  };

  return div;
}

async function loadExperiences() {
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("position");

  expContainer.innerHTML = "";
  data?.forEach(e => expContainer.appendChild(expRow(e)));
}

saveExpBtn?.addEventListener("click", async () => {
  const rows = [...expContainer.children];

  for (let i = 0; i < rows.length; i++) {
    const [title, year, desc] = rows[i].querySelectorAll("input, textarea");

    await supabase.from("experiences").upsert({
      title: title.value,
      year: year.value,
      description: desc.value,
      position: i
    });
  }

  alert("Experiences saved");
});

addExpBtn?.addEventListener("click", () => {
  expContainer.appendChild(expRow());
});

loadExperiences();

/* ===============================
   PORTFOLIO SECTION
================================ */
const portfolioContainer = document.getElementById("portfolioContainer");
const addProjectBtn = document.getElementById("addProject");
const saveProjectsBtn = document.getElementById("saveProjects");

function projectRow(project = {}) {
  const div = document.createElement("div");
  div.className = "repeat-box";

  div.innerHTML = `
    <input placeholder="Project Name" value="${project.title || ""}">
    <input placeholder="Category" value="${project.category || ""}">
    <input placeholder="Website URL" value="${project.link || ""}">
    <textarea rows="3" placeholder="Description">${project.description || ""}</textarea>

    <label>Cover Image</label>
    <input type="file" class="coverInput" accept="image/*">

    ${project.cover_image ? `<img src="${project.cover_image}" class="preview">` : ""}

    <button class="danger">Delete</button>
  `;

  // delete project
  div.querySelector(".danger").onclick = async () => {
    if (project.id) {
      await supabase.from("projects").delete().eq("id", project.id);
    }
    div.remove();
  };

  return div;
}

async function loadProjects() {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at");

  portfolioContainer.innerHTML = "";
  data?.forEach(p => portfolioContainer.appendChild(projectRow(p)));
}

addProjectBtn?.addEventListener("click", () => {
  portfolioContainer.appendChild(projectRow());
});

saveProjectsBtn?.addEventListener("click", async () => {
  const rows = [...portfolioContainer.children];

  for (let row of rows) {
    const inputs = row.querySelectorAll("input, textarea");

    const title = inputs[0].value;
    const category = inputs[1].value;
    const link = inputs[2].value;
    const description = inputs[3].value;

    const fileInput = row.querySelector(".coverInput");
    let coverImageUrl = null;

    // 1️⃣ Upload cover image jika ada
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        alert("Upload image gagal");
        return;
      }

      const { data } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      coverImageUrl = data.publicUrl;
    }

    // 2️⃣ Simpan ke DB
    const { error } = await supabase.from("projects").upsert({
      title,
      category,
      link,
      description,
      ...(coverImageUrl && { cover_image: coverImageUrl })
    });

    if (error) {
      console.error(error);
      alert("Gagal simpan project");
      return;
    }
  }

  alert("Projects saved");
  loadProjects();
});
