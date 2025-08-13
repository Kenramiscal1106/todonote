"use strict";

const successSVG = `<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g clip-path="url(#clip0_53_495)">
    <path
      d="M18.3333 9.2333V9.99997C18.3323 11.797 17.7504 13.5455 16.6744 14.9848C15.5985 16.4241 14.0861 17.477 12.3628 17.9866C10.6395 18.4961 8.79771 18.4349 7.11205 17.8121C5.42639 17.1894 3.9872 16.0384 3.00912 14.5309C2.03105 13.0233 1.56648 11.24 1.68472 9.4469C1.80296 7.65377 2.49766 5.94691 3.66522 4.58086C4.83278 3.21482 6.41064 2.26279 8.16348 1.86676C9.91632 1.47073 11.7502 1.65192 13.3917 2.3833"
      stroke="#3DD47C"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18.3333 3.33337L10 11.675L7.5 9.17504"
      stroke="#3DD47C"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <defs>
    <clipPath id="clip0_53_495">
      <rect width="20" height="20" fill="white" />
    </clipPath>
  </defs>
</svg>
`;

const alertSVG = `<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M8.57502 3.21659L1.51668 14.9999C1.37116 15.2519 1.29416 15.5377 1.29334 15.8287C1.29253 16.1197 1.36793 16.4059 1.51204 16.6587C1.65615 16.9115 1.86396 17.1222 2.11477 17.2698C2.36559 17.4174 2.65068 17.4967 2.94168 17.4999H17.0583C17.3494 17.4967 17.6344 17.4174 17.8853 17.2698C18.1361 17.1222 18.3439 16.9115 18.488 16.6587C18.6321 16.4059 18.7075 16.1197 18.7067 15.8287C18.7059 15.5377 18.6289 15.2519 18.4834 14.9999L11.425 3.21659C11.2765 2.97168 11.0673 2.76919 10.8177 2.62866C10.5681 2.48813 10.2865 2.41431 10 2.41431C9.71357 2.41431 9.43196 2.48813 9.18235 2.62866C8.93275 2.76919 8.72358 2.97168 8.57502 3.21659Z"
    stroke="#AD402D"
    stroke-width="1.66667"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M10 7.5V10.8333"
    stroke="#AD402D"
    stroke-width="1.66667"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M10 14.1666H10.0083"
    stroke="#AD402D"
    stroke-width="1.66667"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;


// code for toast
const drawer = document.querySelector("#toast-drawer");
// const trigger = document.querySelector("#toast-trigger");

// trigger.addEventListener("click", () => {
//   renderToast({
//     message: "Hello, World",
//     type: "alert",
//   });
// });

/**
 * a keyframe for toastKeyframe animation
 * @type {KeyframeEffect}
 */
const toastKeyframe = [
  { opacity: 0, translate: "-1rem 0" },
  { opacity: 1, translate: "0 0" },
];


/**
 * 
 * @param {{type:string, message:string}} notif 
 */
function renderToast(notif) {
  const toastWrapper = document.createElement("div");
  toastWrapper.classList.add("toast", `toast__${notif.type}`);
  const htmlContent = `
    <div class="toast--info">
      ${notif.type === "success" ? successSVG : alertSVG}
      <div>${
        notif.message + " " + Math.floor(Math.random() * 32).toString()
      }</div>
    </div>
  `;
  toastWrapper.innerHTML = htmlContent;

  const toastClose = document.createElement("button");
  toastClose.classList.add("toast--close");
  toastClose.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M15 5L5 15"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5 5L15 15"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>`;

  toastWrapper.appendChild(toastClose);

  setTimeout(() => {
    toastWrapper.animate(toastKeyframe, {
      duration: 200,
      direction: "reverse"
    }).finished.then(() => {
      drawer.removeChild(toastWrapper);
    })
  }, 5000);
  toastClose.addEventListener("click", () => {
    toastWrapper
      .animate(toastKeyframe, {
        duration: 200,
        direction: "reverse",
      })
      .finished.then(() => {
        drawer.removeChild(toastWrapper);
      });
    // drawer.removeChild(toastWrapper);
  });

  drawer.insertBefore(toastWrapper, drawer.firstChild);
  toastWrapper.animate(toastKeyframe, {
    duration: 175,
  });
}


