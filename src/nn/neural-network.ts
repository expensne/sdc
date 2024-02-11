export interface NeuralNetwork {
    randomize(): void;
    predict(inputs: number[]): number[];
    mutate(mutationPropability: number, mutateRate: number): void;
    crossover(other: NeuralNetwork): NeuralNetwork;
    getModel(): string;
    setModel(model: string): void;
    copy(): NeuralNetwork;
}
