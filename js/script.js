let isLowPerf = false;

function togglePerformance() {
  isLowPerf = !isLowPerf;
  document.body.classList.toggle("low-perf", isLowPerf);
  document.querySelector(".perf-toggle").textContent = `Performance Mode: ${
    isLowPerf ? "Low" : "High"
  }`;
}

// Auto-detect slow devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
  const checkPerformance = () => {
    const start = performance.now();
    for (let i = 0; i < 1000000; i++) {}
    const duration = performance.now() - start;

    if (duration > 50) {
      togglePerformance();
      console.log("Low-performance mode auto-enabled");
    }
  };

  setTimeout(checkPerformance, 1000);
}

// Terminal functionality
const input = document.querySelector(".terminal-input");
const output = document.querySelector(".terminal-output");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim();

    if (command) {
      // Add command to output
      const commandLine = document.createElement("div");
      commandLine.innerHTML = `<span class="prompt">> </span>${command}`;
      output.appendChild(commandLine);

      // Add response (you can customize this)
      const response = document.createElement("div");
      response.style.marginBottom = "0.625rem";
      response.textContent = processCommand(command);
      output.appendChild(response);

      // Clear input
      input.value = "";

      // Scroll to bottom
      output.parentElement.scrollTop = output.parentElement.scrollHeight;
    }
  }
});

function processCommand(cmd) {
  const lower = cmd.toLowerCase();

  if (lower === "help") {
    return "Available commands: help, clear, echo [text], date";
  } else if (lower === "clear") {
    while (output.children.length > 2) {
      output.removeChild(output.lastChild);
    }
    return "";
  } else if (lower.startsWith("echo ")) {
    return cmd.substring(5);
  } else if (lower === "date") {
    return new Date().toString();
  } else {
    return `Command not found: ${cmd}`;
  }
}

// Keep input focused
document.querySelector(".crt-content").addEventListener("click", () => {
  input.focus();
});
