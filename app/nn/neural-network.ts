export interface NeuralNetwork {
    initialize(): void;
    predict(inputs: number[]): number[];
    mutate(mutationRate: number): void;
    getModel(): any;
    setModel(model: any): void;
}
