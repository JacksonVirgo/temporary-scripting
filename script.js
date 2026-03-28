document.addEventListener("DOMContentLoaded", () => {
    const gridLinks = document.querySelectorAll("#gridThumbs > a");
    gridLinks.forEach((link) => {
        const img = link.querySelector("img");
        if (!img) return;
        link.style.setProperty("--glow-image", `url('${img.src}')`);
    });
});

class ExpandedGallery {
    galleryImages = null;
    galleryData = [];

    outerElem = null;
    wrapperElem = null;
    figures = [];
    currentIndex = 0;

    constructor(gallerySelector) {
        this.galleryImages = document.querySelectorAll(gallerySelector);
        this.parse();
        this.build();
        this.init();
    }

    parse() {
        if (!this.galleryImages) return;
        this.galleryData = [];
        this.galleryImages.forEach((img) => {
            const url = img.getAttribute("data-src");
            const alt = img.getAttribute("alt");
            this.galleryData.push({
                url,
                alt
            });
        });
    }

    build() {
        this.outerElem = document.createElement("div");
        this.outerElem.className = "expanded-gallery-outer";
        document.body.appendChild(this.outerElem);

        this.wrapperElem = document.createElement("div");
        this.wrapperElem.className = "expanded-gallery-wrapper";
        this.outerElem.appendChild(this.wrapperElem);

        this.galleryData.forEach((data, _index) => {
            const figure = document.createElement("figure");
            figure.className = "expanded-gallery-figure";
            figure.style.display = "none";
            this.wrapperElem.appendChild(figure);
            this.figures.push(figure);

            const imgWrapper = document.createElement("div");
            imgWrapper.className = "expanded-gallery-item-img";
            figure.appendChild(imgWrapper);

            const imageElem = document.createElement("img");
            imageElem.src = data.url;
            imageElem.alt = data.alt;
            imgWrapper.appendChild(imageElem);

            const captionElem = document.createElement("div");
            captionElem.className = "expanded-gallery-caption";
            captionElem.textContent = data.alt;
            imgWrapper.appendChild(captionElem);
        });

        const closeBtn = document.createElement("div");
        closeBtn.className = "expanded-gallery-close";
        closeBtn.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>`;
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.close();
        });
        this.outerElem.appendChild(closeBtn);

        const leftNav = document.createElement("div");
        leftNav.className = "expanded-gallery-nav left";
        leftNav.addEventListener("click", (e) => { e.stopPropagation(); this.prev(); });
        leftNav.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>`;
        this.outerElem.appendChild(leftNav);

        const rightNav = document.createElement("div");
        rightNav.className = "expanded-gallery-nav right";
        rightNav.addEventListener("click", (e) => { e.stopPropagation(); this.next(); });
        rightNav.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
</svg>`;
        this.outerElem.appendChild(rightNav);

        this.outerElem.addEventListener("click", () => this.close());
    }

    init() {
        if (!this.galleryImages || !this.galleryImages.length) return;
        this.galleryImages.forEach((img, index) => {
            img.style.cursor = "pointer";
            img.addEventListener("click", (e) => {
                e.stopPropagation();
                this.currentIndex = index;
                this.open(index);
            });
        });

        document.addEventListener("keydown", (e) => {
            if (!this.outerElem.classList.contains("visible")) return;
            if (e.key === "ArrowRight") this.next();
            if (e.key === "ArrowLeft") this.prev();
            if (e.key === "Escape") this.close();
        });
    }

    open(index) {
        if (!this.outerElem) return;
        const data = this.galleryData[index];
        if (!data) return;

        this.showCurrent();

        this.outerElem.classList.add("visible");
        document.body.style.overflow = "hidden";
    }

    close() {
        this.outerElem.classList.remove("visible");
        document.body.style.overflow = "";
    }

    showCurrent() {
        this.figures.forEach((f, i) => f.style.display = (i === this.currentIndex ? "inline-block" : "none"));
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.figures.length;
        this.showCurrent();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.figures.length) % this.figures.length;
        this.showCurrent();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = new ExpandedGallery('.gallery-strips-wrapper .gallery-strips-item div.gallery-strips-item-wrapper img');
    console.log(gallery.galleryImages.length);
});

