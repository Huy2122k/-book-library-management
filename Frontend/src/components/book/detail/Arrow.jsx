const CreatorArrowPrev = ({ currentSlide: _, slideCount: __, ...props }) => {
    return (
        <div {...props}>
            <svg width={35} height={35} fill="none">
                <path
                    d="M7 13 1 7.012 6.928 1"
                    stroke="#000"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

const CreatorArrowNext = ({ currentSlide: _, slideCount: __, ...props }) => {
    return (
        <div {...props}>
            <svg width={8} height={14} fill="none">
                <path
                    d="m1 13 6-5.988L1.072 1"
                    stroke="#000"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export { CreatorArrowPrev, CreatorArrowNext };
