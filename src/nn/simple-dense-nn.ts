import { Mathh } from "@/math/math";
import { NeuralNetwork } from "@/nn/neural-network";
import { Matrix } from "@/math/matrix";

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
        let outputVec = Matrix.fromArray1D(inputs);
        for (let i = 0; i < this.layers.length; ++i) {
            outputVec = this.layers[i].forward(outputVec);
        }
        return outputVec.toArray1D().map((x) => Math.round(x));
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

        const otherCopy = other.copy() as SimpleDenseNN;
        const otherLayers = otherCopy.layers;

        // TODO: not on layer level, but on neuron level
        const crossoverPoint = Math.floor(Math.random() * this.layers.length);
        for (let i = crossoverPoint; i < this.layers.length; ++i) {
            thisChild.layers[i].weight = otherLayers[i].weight;
            thisChild.layers[i].bias = otherLayers[i].bias;
        }

        return thisChild;
    }

    getModel(): string {
        const serializedLayers = this.layers.map((layer) => ({
            weight: layer.weight.serialize(),
            bias: layer.bias.serialize(),
        }));
        return JSON.stringify(serializedLayers);
    }

    setModel(model: string): void {
        const deserializedLayers = JSON.parse(model);
        if (deserializedLayers.length !== this.layers.length) {
            throw new Error("Invalid model");
        }

        this.layers.forEach((layer, i) => {
            layer.weight = Matrix.deserialize(deserializedLayers[i].weight);
            layer.bias = Matrix.deserialize(deserializedLayers[i].bias);
        });
    }

    copy(): NeuralNetwork {
        const nn = new SimpleDenseNN(this.neuronsPerLayer);
        nn.setModel(this.getModel());
        return nn;
    }

    // TODO remove
    debughash(): number {
        let hash = 0;
        for (let i = 0; i < this.layers.length; ++i) {
            const layer = this.layers[i];
            hash += layer.weight.summed();
            hash += layer.bias.summed();
        }
        return hash;
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
        const raw = Matrix.add(Matrix.dot(input.transposed(), this.weight), this.bias);
        const activated = raw.map((x) => Mathh.sigmoid(x));
        return activated.transposed();
    }
}
