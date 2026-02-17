const path = require("path")

module.exports = async (kernel) => {
  const { platform, gpu } = kernel
  let onnxruntime = "default"

  if (platform === "darwin") {
    onnxruntime = "coreml"
  } else if (platform === "linux" && gpu === "amd") {
    onnxruntime = "rocm"
  } else if (platform === "win32" && gpu === "amd") {
    onnxruntime = "directml"
  } else if ((platform === "linux" || platform === "win32") && gpu === "intel") {
    onnxruntime = "openvino"
  } else if ((platform === "linux" || platform === "win32") && gpu === "nvidia") {
    onnxruntime = "cuda"
  }

  return {
    run: [
      {
        when: "{{!exists('app')}}",
        method: "shell.run",
        params: {
          message: "git clone https://github.com/facefusion/facefusion.git --branch 3.5.3 --single-branch app"
        }
      },
      {
        method: "shell.run",
        params: {
          message: "conda install conda=25.5.1 --yes"
        }
      },
      {
        method: "shell.run",
        params: {
          message: "conda install python=3.12 --yes",
          conda: {
            path: path.resolve(__dirname, ".env")
          }
        }
      },
      {
        method: "shell.run",
        params: {
          message: "conda install conda-forge::ffmpeg=7.0.2 conda-forge::libvorbis=1.3.7 --yes",
          conda: {
            path: path.resolve(__dirname, ".env")
          }
        }
      },
      {
        when: "{{(platform === 'linux' || platform === 'win32') && gpu === 'intel'}}",
        method: "shell.run",
        params: {
          message: "conda install conda-forge::openvino=2025.1.0 --yes",
          conda: {
            path: path.resolve(__dirname, ".env")
          }
        }
      },
      {
        when: "{{(platform === 'linux' || platform === 'win32') && gpu === 'nvidia'}}",
        method: "shell.run",
        params: {
          message: [
            "conda install nvidia/label/cuda-12.9.1::cuda-runtime nvidia/label/cudnn-9.10.0::cudnn --yes",
            "pip install tensorrt==10.12.0.36 --extra-index-url https://pypi.nvidia.com"
          ],
          conda: {
            path: path.resolve(__dirname, ".env")
          }
        }
      },
      {
        method: "shell.run",
        params: {
          path: "app",
          conda: {
            path: path.resolve(__dirname, ".env")
          },
          message: `python install.py --onnxruntime ${onnxruntime}`
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
}
