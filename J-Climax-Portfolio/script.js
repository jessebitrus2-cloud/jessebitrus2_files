const featuredProjects = [
    {
        title: "J-Climax AudioLab",
        description:
            "Interactive audio visualizer and playlist manager built with modern web technologies.",
        image: "images/j-climax-audio.jpg",
        alt: "J-Climax AudioLab"
    },
    {
        title: "Grade 4 Mathematics Adventure",
        description:
            "An educational mathematics game designed to make learning mathematics interactive and fun for children.",
        image: "images/delight-math.jpg",
        alt: "Grade 4 Mathematics Adventure"
    },
    {
        title: "Weather App",
        description:
            "A weather application that retrieves current weather information and forecasts for different locations.",
        image: "images/weather-app.jpg",
        alt: "Weather App"
    },
    {
        title: "Student Registration System",
        description:
            "A database-driven student registration system for managing students, programmes, courses, semesters and registrations.",
        image: "images/student-registration.png",
        alt: "Student Registration System"
    }
];

let currentProject = 0;

const previewImage = document.getElementById("preview-image");
const previewTitle = document.getElementById("preview-title");
const previewDescription = document.getElementById("preview-description");
const projectCounter = document.getElementById("project-counter");

const previousButton = document.getElementById("prev-project");
const nextButton = document.getElementById("next-project");


function showProject(index) {

    const project = featuredProjects[index];

    previewImage.src = project.image;
    previewImage.alt = project.alt;

    previewTitle.textContent = project.title;
    previewDescription.textContent = project.description;

    projectCounter.textContent =
        `${index + 1} / ${featuredProjects.length}`;
}


previousButton.addEventListener("click", () => {

    currentProject--;

    if (currentProject < 0) {
        currentProject = featuredProjects.length - 1;
    }

    showProject(currentProject);
});


nextButton.addEventListener("click", () => {

    currentProject++;

    if (currentProject >= featuredProjects.length) {
        currentProject = 0;
    }

    showProject(currentProject);
});


showProject(currentProject);

// Automatic project slider
setInterval(() => {

    currentProject++;

    if (currentProject >= featuredProjects.length) {
        currentProject = 0;
    }

    showProject(currentProject);

}, 5000);

// Contact form submission
document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");

    if (!contactForm) {
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        formMessage.textContent = "";

        try {

            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                formMessage.textContent =
                    "Thank you! Your message has been sent successfully.";

                formMessage.style.color = "lightgreen";

                contactForm.reset();

                setTimeout(() => {
                    formMessage.textContent = "";
                }, 5000);

            } else {

                formMessage.textContent =
                    "Sorry, your message could not be sent. Please try again.";

                formMessage.style.color = "red";
            }

        } catch (error) {

            console.error("Form submission error:", error);

            formMessage.textContent =
                "Sorry, something went wrong. Please try again.";

            formMessage.style.color = "red";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Send Message";

        }
    });
});