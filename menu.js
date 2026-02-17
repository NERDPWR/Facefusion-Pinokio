module.exports = async (kernel, info) => {
  const menu = []
  const installed = info.exists(".env")
  const running = {
    run: info.running("run.js"),
    install: info.running("install.js"),
    update: info.running("update.js"),
    reset: info.running("reset.js")
  }

  if (!installed) {
    return [{
      default: true,
      icon: "fa-solid fa-plug",
      text: "Install",
      href: "install.js"
    }]
  }

  if (!running.run && !running.install && !running.update && !running.reset) {
    return [{
      default: true,
      icon: "fa-solid fa-power-off",
      text: "Run Default",
      href: "run.js",
      params: {
        mode: "Default"
      }
    }, {
      icon: "fa-solid fa-robot",
      text: "Run Default+Jobs",
      href: "run.js",
      params: {
        mode: "Default+Jobs"
      }
    }, {
      icon: "fa-solid fa-gauge",
      text: "Run Benchmark",
      href: "run.js",
      params: {
        mode: "Benchmark"
      }
    }, {
      icon: "fa-solid fa-camera",
      text: "Run Webcam",
      href: "run.js",
      params: {
        mode: "Webcam"
      }
    }, {
      icon: "fa-solid fa-arrows-rotate",
      text: "Update",
      href: "update.js"
    }, {
      icon: "fa-solid fa-plug",
      text: "Install",
      href: "install.js"
    }, {
      icon: "fa-solid fa-broom",
      text: "Reset",
      href: "reset.js"
    }]
  }

  if (running.run) {
    const local = info.local("run.js")
    if (local && local.url && local.mode) {
      menu.push({
        default: true,
        icon: "fa-solid fa-rocket",
        text: `UI (${local.mode})`,
        href: local.url
      })
    }
    menu.push({
      icon: "fa-solid fa-terminal",
      text: "CLI",
      href: "run.js"
    })
    return menu
  }

  if (running.install) {
    return [{
      default: true,
      icon: "fa-solid fa-plug",
      text: "Installing",
      href: "install.js"
    }]
  }

  if (running.update) {
    return [{
      default: true,
      icon: "fa-solid fa-arrows-rotate",
      text: "Updating",
      href: "update.js"
    }]
  }

  return [{
    default: true,
    icon: "fa-solid fa-broom",
    text: "Resetting",
    href: "reset.js"
  }]
}
