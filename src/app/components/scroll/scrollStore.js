export const scrollStore = {
  progress: 0,     // 0..1 over full page
  heroProgress: 0, // 0..1 over the first viewport (hero) only
  velocity: 0,
  mouseX: 0,       // -1..1
  mouseY: 0,       // -1..1
};

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    scrollStore.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    scrollStore.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
  });
}
