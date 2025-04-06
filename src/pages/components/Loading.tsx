import { CircleSpinnerOverlay } from 'react-spinner-overlay'

const Loading = () => {
    return (
        <CircleSpinnerOverlay
            loading={true}
            size={100}
            overlayColor="rgba(0, 0, 0, 0.5)"
        />
    );
};

export default Loading;