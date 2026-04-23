export const secondaryModel = {
    async getExplanationOfSequence (sequence) {
        const result = await fetch("http://localhost:8000/explain?chords=" + encodeURIComponent(sequence));
        const data = await result.json();
    }
}


