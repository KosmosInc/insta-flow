const storageKey = "insta-flow-reel-idea";

const ideaForm = document.getElementById("idea-form");
const ideaInput = document.getElementById("idea-input");
const saveStatus = document.getElementById("save-status");
const generateButton = document.getElementById("generate-button");
const exportButton = document.getElementById("export-button");
const hookList = document.getElementById("hook-list");
const flowList = document.getElementById("flow-list");
const captionAngle = document.getElementById("caption-angle");
const ctaAngle = document.getElementById("cta-angle");

const updateStatus = (message) => {
  saveStatus.textContent = message;
};

const toTitleCase = (value) =>
  value.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

const setListItems = (element, items) => {
  element.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
};

const buildPlan = (idea) => {
  const cleanIdea = idea.replace(/\s+/g, " ").trim();
  const compactIdea = cleanIdea.replace(/[.?!]+$/, "");
  const displayIdea = toTitleCase(compactIdea);

  return {
    hooks: [
      `Stop scrolling if you've been thinking about ${compactIdea}.`,
      `Nobody talks about this part of ${compactIdea}, but it changes everything.`,
      `Here's how I'd turn ${compactIdea} into a Reel people actually watch.`
    ],
    flow: [
      `Open with a bold one-line opinion about ${compactIdea}.`,
      `Cut to 2 or 3 fast examples, visuals, or mistakes people make.`,
      `Finish with the takeaway viewers can apply right away.`
    ],
    caption: `A sharp Reel about ${displayIdea} with a practical takeaway and a clear point of view.`,
    cta: `End with: "Want more Reel ideas like this? Comment 'ideas' and I'll make part two."`
  };
};

const renderPlan = (idea) => {
  const plan = buildPlan(idea);
  setListItems(hookList, plan.hooks);
  setListItems(flowList, plan.flow);
  captionAngle.textContent = plan.caption;
  ctaAngle.textContent = plan.cta;
};

const loadSavedIdea = () => {
  const savedIdea = window.localStorage.getItem(storageKey);

  if (savedIdea) {
    ideaInput.value = savedIdea;
    updateStatus("Loaded your last saved Reel idea.");
    renderPlan(savedIdea);
  }
};

ideaForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nextIdea = ideaInput.value.trim();

  if (!nextIdea) {
    window.localStorage.removeItem(storageKey);
    updateStatus("Idea box cleared.");
    return;
  }

  window.localStorage.setItem(storageKey, nextIdea);
  updateStatus("Reel idea saved in this browser.");
  renderPlan(nextIdea);
});

generateButton.addEventListener("click", () => {
  const nextIdea = ideaInput.value.trim();

  if (!nextIdea) {
    updateStatus("Add an idea first, then generate a plan.");
    return;
  }

  renderPlan(nextIdea);
  updateStatus("Content plan generated.");
});

exportButton.addEventListener("click", () => {
  const nextIdea = ideaInput.value.trim();

  if (!nextIdea) {
    updateStatus("Add an idea first, then export your notes.");
    return;
  }

  const plan = buildPlan(nextIdea);
  const exportText = [
    "Insta Flow Reel Notes",
    "",
    `Idea: ${nextIdea}`,
    "",
    "Hook ideas:",
    ...plan.hooks.map((hook) => `- ${hook}`),
    "",
    "Shot flow:",
    ...plan.flow.map((step) => `- ${step}`),
    "",
    `Caption angle: ${plan.caption}`,
    `Call to action: ${plan.cta}`
  ].join("\n");

  const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "insta-flow-reel-notes.txt";
  link.click();
  URL.revokeObjectURL(url);

  updateStatus("Notes exported.");
});

loadSavedIdea();
