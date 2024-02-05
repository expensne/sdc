import * as mathh from "math/math";
import { NeuralNetwork } from "nn/neural-network";

export class SimpleDenseNN implements NeuralNetwork {
    private layers: Layer[];

    constructor(layerSizes: number[]) {
        this.layers = new Array(layerSizes.length - 1);
        for (let i = 0; i < this.layers.length; ++i) {
            this.layers[i] = new Layer(layerSizes[i], layerSizes[i + 1]);
        }
    }

    public initialize(): void {
        this.layers.forEach((layer) => layer.randomize());
    }

    public predict(inputs: number[]): number[] {
        let output = inputs;
        for (let i = 0; i < this.layers.length; ++i) {
            output = this.layers[i].forward(output);
        }
        return output;
    }

    public getModel(): { weights: number[][][]; biases: number[][] } {
        const weights = this.layers.map((layer) => layer.weights);
        const biases = this.layers.map((layer) => layer.biases);

        return { weights, biases };
    }

    public setModel({ weights, biases }: { weights: number[][][]; biases: number[][] }): void {
        weights = JSON.parse(JSON.stringify(weights));
        biases = JSON.parse(JSON.stringify(biases));

        this.layers.forEach((layer, i) => {
            layer.weights = weights[i];
            layer.biases = biases[i];
        });
    }

    public mutate(mutationRate: number): void {
        this.layers.forEach((layer) => {
            for (let i = 0; i < layer.numInputs; ++i) {
                for (let j = 0; j < layer.numOutputs; ++j) {
                    let oldWeight = layer.weights[i][j];
                    let newWeight = oldWeight + mathh.normal(0, mutationRate);
                    layer.weights[i][j] = newWeight;
                }
            }

            for (let i = 0; i < layer.numOutputs; ++i) {
                let oldBias = layer.biases[i];
                let newBias = oldBias + mathh.normal(0, mutationRate);
                layer.biases[i] = newBias;
            }
        });
    }
}

class Layer {
    public numInputs: number;
    public numOutputs: number;

    public weights: number[][];
    public biases: number[];

    constructor(numInputs: number, numOutputs: number) {
        this.numInputs = numInputs;
        this.numOutputs = numOutputs;

        this.weights = new Array(numInputs).fill(0).map(() => new Array(numOutputs).fill(0));
        this.biases = new Array(numOutputs).fill(0);
    }

    public randomize(): void {
        this.weights = this.weights.map((column) => column.map(() => mathh.normal()));
        this.biases = this.biases.map(() => mathh.normal());
    }

    public forward(inputs: number[]): number[] {
        const output = new Array(this.numOutputs).fill(0);

        for (let i = 0; i < this.numInputs; ++i) {
            for (let j = 0; j < this.numOutputs; ++j) {
                output[j] += inputs[i] * this.weights[i][j];
            }
        }

        for (let i = 0; i < this.numOutputs; ++i) {
            //output[i] = mathh.sigmoid(output[i] + this.biases[i]);
            //output[i] = output[i] + this.biases[i];
            output[i] = this.biases[i] < output[i] ? 1 : 0;
        }

        return output;
    }
}
