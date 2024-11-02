function animations(){

    function observeElements(elements, className) {

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                } else {
                    entry.target.classList.remove(className);
                }
            });
        });
    
        elements.forEach((element) => {
            observer.observe(element);
        });

    }
    
    const elementsLeft = document.querySelectorAll('.hidden-left');
    const elementsRight = document.querySelectorAll('.hidden-right');
    const elementsLeftNone = document.querySelectorAll('.hidden-left-none');
    const elementsBottom = document.querySelectorAll('.hidden-bottom');
    const elementsTop = document.querySelectorAll('.hidden-top');
    
    observeElements(elementsLeft, 'show-horizontal');
    observeElements(elementsRight, 'show-horizontal');
    observeElements(elementsBottom, 'show-vertical');
    observeElements(elementsTop, 'show-vertical');
    observeElements(elementsLeftNone, 'show-left-none');

}


export default animations;
