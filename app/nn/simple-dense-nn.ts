import { Mathh } from "math/math";
import { NeuralNetwork } from "nn/neural-network";
import { Matrix } from "math/matrix";

export class SimpleDenseNN implements NeuralNetwork {
    public readonly neuronsPerLayer: number[];
    private readonly initFunc: (...args: any[]) => number;
    protected readonly layers: Layer[];

    constructor(neuronsPerLayer: number[]) {
        this.neuronsPerLayer = neuronsPerLayer;
        this.initFunc = Mathh.normal;

        this.layers = new Array(neuronsPerLayer.length - 1);
        for (let i = 0; i < this.layers.length; ++i) {
            this.layers[i] = new Layer(neuronsPerLayer[i], neuronsPerLayer[i + 1], this.initFunc);
        }
    }

    randomize(): void {
        this.layers.forEach((layer) => layer.randomize());
    }

    predict(inputs: number[]): number[] {
        let outputMat = Matrix.fromArray(inputs);
        for (let i = 0; i < this.layers.length; ++i) {
            outputMat = this.layers[i].forward(outputMat);
        }
        return outputMat.toArray().map((x) => Math.round(x));
    }

    mutate(mutationPropability: number, mutateRate: number): void {
        this.layers.forEach((layer) => {
            layer.weight.map((w, _, __) =>
                Mathh.randomTrue(mutationPropability) ? this.initFunc(w, mutateRate) : w
            );
            layer.bias.map((b, _, __) =>
                Mathh.randomTrue(mutationPropability) ? this.initFunc(b, mutateRate) : b
            );
        });
    }

    crossover(other: NeuralNetwork): NeuralNetwork {
        if (!(other instanceof SimpleDenseNN)) {
            throw new Error("Cannot crossover with different type of neural network");
        }

        const thisChild = this.copy() as SimpleDenseNN;
        const otherLayers = other.layers;

        const crossoverPoint = Math.floor(Math.random() * this.layers.length);
        for (let i = crossoverPoint; i < this.layers.length; ++i) {
            thisChild.layers[i].weight = otherLayers[i].weight;
            thisChild.layers[i].bias = otherLayers[i].bias;
        }

        return thisChild;
    }

    getModel(): string {
        const weightsSerialized = this.layers.map((layer) => layer.weight.serialize());
        const biasesSerialized = this.layers.map((layer) => layer.bias.serialize());
        const internals = [weightsSerialized, biasesSerialized];
        return JSON.stringify(internals);
    }

    setModel(model: string): void {
        const internals = JSON.parse(model);
        const weights = internals[0];
        const biases = internals[1];
        this.layers.forEach((layer, i) => {
            layer.weight = Matrix.deserialize(weights[i])!;
            layer.bias = Matrix.deserialize(biases[i])!;
        });
    }

    copy(): NeuralNetwork {
        const nn = new SimpleDenseNN(this.neuronsPerLayer);
        nn.setModel(this.getModel());
        return nn;
    }
}

class Layer {
    public readonly numInputs: number;
    public readonly numOutputs: number;

    public weight: Matrix;
    public bias: Matrix;

    private readonly initFunc: () => number;

    constructor(
        numInputs: number,
        numOutputs: number,
        initFunc: (...args: any[]) => number = Mathh.normal
    ) {
        this.numInputs = numInputs;
        this.numOutputs = numOutputs;
        this.initFunc = initFunc;

        this.weight = new Matrix(numInputs, numOutputs);
        this.bias = new Matrix(1, numOutputs);
    }

    randomize(): void {
        this.weight.randomize(() => this.initFunc());
        this.bias.randomize(() => this.initFunc());
    }

    forward(input: Matrix): Matrix {
        const raw = input.transposed().dot(this.weight).add(this.bias);
        const activated = raw.map((x) => Mathh.sigmoid(x));
        return activated.transposed();
    }
}
