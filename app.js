
$(document).ready(function () {

    let currentSlide = 0;

    const slides = $(".business-slide");
    const dots = $(".dot");

    const totalSlides = slides.length;


    function showSlide(index) {

        slides.removeClass("active");
        dots.removeClass("active");

        $(slides[index]).addClass("active");
        $(dots[index]).addClass("active");

        $("#current-slide").text(
            String(index + 1).padStart(2)
        );
    }


    function nextSlide() {

        currentSlide++;

        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    }


    /*
        Avtomatik reklam dəyişməsi
        hər 5 saniyədən bir
    */

    let sliderInterval = setInterval(
        nextSlide,
        5000
    );


    /*
        Dot-a klik
    */

    $(".dot").on("click", function () {

        currentSlide = $(this).index();

        showSlide(currentSlide);


        /*
            İstifadəçi klik etdikdən sonra
            timer yenidən başlayır
        */

        clearInterval(sliderInterval);

        sliderInterval = setInterval(
            nextSlide,
            4000
        );

    });


    /*
        Reklamın özünə klik
        növbəti reklam
    */

    $(".business-arrow").on("click", function () {

        nextSlide();

        clearInterval(sliderInterval);

        sliderInterval = setInterval(
            nextSlide,
            4000
        );

    });


    /*
        Mobil üçün swipe
    */

    let startX = 0;

    $(".business-slider").on("touchstart", function (e) {

        startX = e.originalEvent.touches[0].clientX;

    });


    $(".business-slider").on("touchend", function (e) {

        let endX =
            e.originalEvent.changedTouches[0].clientX;

        let difference = startX - endX;


        if (Math.abs(difference) > 50) {

            if (difference > 0) {

                nextSlide();

            } else {

                currentSlide--;

                if (currentSlide < 0) {
                    currentSlide = totalSlides - 1;
                }

                showSlide(currentSlide);

            }


            clearInterval(sliderInterval);

            sliderInterval = setInterval(
                nextSlide,
                4000
            );

        }

    });


    /*
        Search
    */

    $("#search-btn").on("click", function () {

        let searchValue =
            $("#search-input").val().trim();

        if (searchValue !== "") {

            console.log(
                "Axtarış:",
                searchValue
            );

        }

    });


    /*
        Enter düyməsi ilə axtarış
    */

    $("#search-input").on("keypress", function (e) {

        if (e.which === 13) {

            $("#search-btn").click();

        }

    });


    /*
        Favorite
    */

    $(".favorite").on("click", function (e) {

        e.stopPropagation();

        const icon = $(this).find("i");

        icon.toggleClass(
            "fa-regular fa-solid"
        );

    });


    /*
        Bottom navigation
    */

    $(".navbar-item").on("click", function () {

        $(".navbar-item")
            .removeClass("active");

        $(this)
            .addClass("active");

    });

});




/* =====================================================
   CATEGORY MODAL
===================================================== */

const categoryModal = $(".category-modal");


/*
    Aç
*/

$(".open-categories-modal").on("click", function (e) {

    e.preventDefault();

    categoryModal.addClass("active");

    $("body").css("overflow", "hidden");

});


/*
    Bağla — X düyməsi
*/

$(".modal-close").on("click", function () {

    closeCategoryModal();

});


/*
    Bağla — arxa fonda klik
*/

$(".category-modal-overlay").on("click", function () {

    closeCategoryModal();

});


/*
    ESC düyməsi
*/

$(document).on("keydown", function (e) {

    if (e.key === "Escape") {

        closeCategoryModal();

    }

});


/*
    Modal bağlama funksiyası
*/

function closeCategoryModal() {

    categoryModal.removeClass("active");

    $("body").css("overflow", "");

}

/* =====================================================
   MENU MODAL
===================================================== */

const menuModal = $(".menu-modal");


/* Open */

$(".header-menu").on("click", function () {

    menuModal.addClass("active");

    $("body").css("overflow", "hidden");

});


/* Close button */

$(".menu-modal-close").on("click", function () {

    closeMenuModal();

});


/* Click outside */

$(".menu-modal-overlay").on("click", function () {

    closeMenuModal();

});


/* ESC */

$(document).on("keydown", function (e) {

    if (e.key === "Escape") {

        closeMenuModal();

    }

});


/* Close function */

function closeMenuModal() {

    menuModal.removeClass("active");

    $("body").css("overflow", "");

}


/* =====================================================
   PRODUCT MODAL
===================================================== */

const productModal = $(".product-modal");

let productImages = [];

let currentProductSlide = 0;


/* =====================================================
   OPEN PRODUCT
===================================================== */

$(".last-ad").on("click", function () {

    const card = $(this);


    /* -----------------------------------------
       Get information from card
    ----------------------------------------- */

    const title =
        card.find(".ad-content h3").text().trim();

    const description =
        card.find(".ad-description").text().trim();

    const oldPrice =
        card.find(".old-price").text().trim();

    const newPrice =
        card.find(".new-price").text().trim();

    const city =
        card.find(".ad-info span:first-child").text().trim();

    const date =
        card.find(".ad-info span:last-child").text().trim();


    /* -----------------------------------------
       Put information into modal
    ----------------------------------------- */

    $(".product-modal-title").text(title);

    $(".product-modal-description").text(description);

    $(".product-old-price").text(oldPrice);

    $(".product-new-price").text(newPrice);

    $(".product-city").text(city);

    $(".product-date-value").text(date);


    /* -----------------------------------------
       Get images
    ----------------------------------------- */

    productImages = [];


    /*
       Main image
    */

    const mainImage =
        card.find(".ad-image img").attr("src");


    if (mainImage) {

        productImages.push(mainImage);

    }


    /*
       Additional images from data-images
    */

    const additionalImages =
        card.attr("data-images");


    if (additionalImages) {

        const images =
            additionalImages
                .split(",")
                .map(function (image) {
                    return image.trim();
                })
                .filter(function (image) {
                    return image !== "";
                });


        images.forEach(function (image) {

            /*
               Don't duplicate main image
            */

            if (image !== mainImage) {

                productImages.push(image);

            }

        });

    }


    /* -----------------------------------------
       Create slides
    ----------------------------------------- */

    renderProductSlider();


    /* -----------------------------------------
       Open modal
    ----------------------------------------- */

    productModal.addClass("active");

    $("body").css("overflow", "hidden");

});


/* =====================================================
   RENDER SLIDER
===================================================== */

function renderProductSlider() {

    const slidesContainer =
        $(".product-slides");

    const dotsContainer =
        $(".product-slider-dots");


    slidesContainer.empty();

    dotsContainer.empty();


    currentProductSlide = 0;


    productImages.forEach(function (image, index) {


        /* Slide */

        const slide = $(`
            <div class="product-slide">

                <img src="${image}" alt="">

            </div>
        `);


        if (index === 0) {

            slide.addClass("active");

        }


        slidesContainer.append(slide);


        /* Dot */

        const dot = $(`
            <span class="product-dot"></span>
        `);


        if (index === 0) {

            dot.addClass("active");

        }


        dotsContainer.append(dot);

    });


    updateProductCounter();


    /*
       Hide arrows if only one image
    */

    if (productImages.length <= 1) {

        $(".product-slider-arrow").hide();

        $(".product-slider-dots").hide();

    } else {

        $(".product-slider-arrow").show();

        $(".product-slider-dots").show();

    }

}


/* =====================================================
   SHOW SLIDE
===================================================== */

function showProductSlide(index) {

    if (productImages.length === 0) {

        return;

    }


    if (index < 0) {

        index = productImages.length - 1;

    }


    if (index >= productImages.length) {

        index = 0;

    }


    currentProductSlide = index;


    $(".product-slide")
        .removeClass("active");

    $(".product-dot")
        .removeClass("active");


    $(".product-slide")
        .eq(index)
        .addClass("active");

    $(".product-dot")
        .eq(index)
        .addClass("active");


    updateProductCounter();

}


/* =====================================================
   COUNTER
===================================================== */

function updateProductCounter() {

    $(".product-modal-counter").text(

        (currentProductSlide + 1)
        + " / "
        + productImages.length

    );

}


/* =====================================================
   NEXT
===================================================== */

$(".product-next").on("click", function (e) {

    e.stopPropagation();

    showProductSlide(
        currentProductSlide + 1
    );

});


/* =====================================================
   PREVIOUS
===================================================== */

$(".product-prev").on("click", function (e) {

    e.stopPropagation();

    showProductSlide(
        currentProductSlide - 1
    );

});


/* =====================================================
   DOT CLICK
===================================================== */

$(document).on(
    "click",
    ".product-dot",
    function () {

        showProductSlide(
            $(this).index()
        );

    }
);


/* =====================================================
   CLOSE
===================================================== */

$(".product-modal-close").on("click", function () {

    closeProductModal();

});


/* Click outside */

$(".product-modal-overlay").on("click", function () {

    closeProductModal();

});


/* ESC */

$(document).on("keydown", function (e) {

    if (e.key === "Escape") {

        closeProductModal();

    }

});


/* =====================================================
   CLOSE FUNCTION
===================================================== */

function closeProductModal() {

    productModal.removeClass("active");

    $("body").css("overflow", "");

}

/* =====================================================
   MOBILE SWIPE
===================================================== */

let productTouchStartX = 0;
let productTouchEndX = 0;


$(".product-slider").on(
    "touchstart",
    function (e) {

        productTouchStartX =
            e.originalEvent.touches[0].clientX;

    }
);


$(".product-slider").on(
    "touchend",
    function (e) {

        productTouchEndX =
            e.originalEvent.changedTouches[0].clientX;


        const difference =
            productTouchStartX -
            productTouchEndX;


        if (Math.abs(difference) < 50) {

            return;

        }


        if (difference > 0) {

            /* Swipe left */

            showProductSlide(
                currentProductSlide + 1
            );

        } else {

            /* Swipe right */

            showProductSlide(
                currentProductSlide - 1
            );

        }

    }
);
