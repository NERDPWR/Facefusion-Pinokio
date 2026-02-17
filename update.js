const path = require("path")
const FACEFUSION_353_COMMIT = "8801668562cda5fd396b11ae4be05af2abfca83d"

module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: "git pull"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git fetch --tags --force"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: `git checkout ${FACEFUSION_353_COMMIT}`
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        conda: {
          path: path.resolve(__dirname, ".env")
        },
        message: "python ../apply_windows_orientation_patch.py"
      }
    }
  ]
}
