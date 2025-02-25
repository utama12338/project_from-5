import type { Metric } from 'web-vitals';

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = async (onPerfEntry?: ReportHandler) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        const webVitals = await import('web-vitals');
        webVitals.onCLS(onPerfEntry);
        webVitals.onFID(onPerfEntry);
        webVitals.onFCP(onPerfEntry);
        webVitals.onLCP(onPerfEntry);
        webVitals.onTTFB(onPerfEntry);
    }
}

export default reportWebVitals;