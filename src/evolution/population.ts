import { Car } from "../game-objects/car";
import { SimpleDenseNN } from "../nn/simple-dense-nn";

export class CarPopulation {
    private readonly STORAGE_KEY = "nn-models";

    public cars: Car[];
    public generation: number;

    constructor(cars: Car[], generation: number = 0) {
        this.cars = cars;
        this.generation = generation;
    }

    private static fitness(car: Car): number {
        // return -car.y; // WTF??
        return car.y;
    }

    evaluate(): void {
        this.cars = this.cars.sort(
            (a, b) => CarPopulation.fitness.call({}, a) - CarPopulation.fitness.call({}, b)
        );

        const topTenPercent = Math.floor(this.cars.length * 0.1);
        for (let i = 0; i < this.cars.length; i++) {
            const car = this.cars[i];
            car.drawSensor = i == 0;

            if (i < topTenPercent) {
                car.drawStroke = true;
            } else {
                car.drawStroke = false;
            }
        }
    }

    loadAndEvolve(mutationPropability: number, mutateRate: number): void {
        this.loadFromStorage();
        this.evolve(mutationPropability, mutateRate);
    }

    evolve(mutationPropability: number, mutateRate: number): void {
        const populationSize = this.cars.length;
        const numElite = Math.floor(populationSize * 0.1); // 10%

        // Keep the top 10% of the population
        const eliteCars = this.cars.slice(0, numElite);
        eliteCars.forEach((car) => (car.normalColor = "Magenta"));
        eliteCars[0].normalColor = "Yellow";

        // Copy the top 10% of the population to the bottom of the population
        for (let i = 0; i < numElite; i++) {
            const eliteCar = eliteCars[i];
            const tmpCar = this.cars[numElite + i]!;
            tmpCar.ai!.setModel(eliteCar.ai!.getModel());
            tmpCar.normalColor = "Green";
        }
        // Mutate all except the top 10%
        for (let i = numElite; i < populationSize; i++) {
            const car = this.cars[i];
            car.ai!.mutate(mutationPropability, mutateRate);
        }

        /*
        // Crossover and mutate the rest of the population
        for (let i = numElite; i < populationSize; i++) {
            const parentA = this.cars[Math.floor(Math.random() * numElite)];
            const parentB = this.cars[Math.floor(Math.random() * numElite)];

            const child = parentA.ai!.crossover(parentB.ai!);
            child.mutate(mutationPropability, mutateRate);

            //this.cars[i].ai = child;
            this.cars[i].ai!.setModel(child.getModel());
        }
        */

        this.generation++;
    }

    saveToStorage(): void {
        const ais = this.cars.map((car) => car.ai!.getModel());
        const population = { generation: this.generation, ais };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(population));

        console.log("Saved models to local storage");
    }

    loadFromStorage(): void {
        const population = localStorage.getItem(this.STORAGE_KEY);
        if (!population) {
            console.log("No models found in local storage");
            return;
        }

        const parsedPopulation = JSON.parse(population);
        const generation = parsedPopulation.generation;
        const ais = parsedPopulation.ais;

        this.generation = generation;

        if (ais.some((ai: string) => !ai)) {
            throw new Error("Some models are missing");
        }

        if (this.cars.length != ais.length) {
            throw new Error();
        }

        this.cars.forEach((car, i) => {
            car.ai!.setModel(ais[i]);
        });

        console.log("Restored models from local storage");
    }

    clearStore(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log("Cleared models from local storage");
    }
}
