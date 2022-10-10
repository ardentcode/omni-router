import './loading-indicator.css';

export class LoadingIndicator {
    private readonly indicatorElement: HTMLElement;

    constructor() {
        this.indicatorElement = document.createElement('div');
        this.indicatorElement.className = 'loading-indicator';
        this.indicatorElement.style.display = 'none';
        document.body.appendChild(this.indicatorElement);
    }

    public show(): void {
        this.indicatorElement.style.display = 'inline-block';
    }

    public hide(): void {
        this.indicatorElement.style.display = 'none';
    }
}
