import { SimpleDenseNN } from "@/nn/simple-dense-nn";

describe("SimpleDenseNN", () => {
    let nn: SimpleDenseNN;

    beforeEach(() => {
        nn = new SimpleDenseNN([2, 3, 1]);
        nn.randomize();
    });

    test("getModel should return a string representation of the model", () => {
        const model = nn.getModel();
        expect(typeof model).toBe("string");

        const parsedModel = JSON.parse(model);
        expect(Array.isArray(parsedModel)).toBe(true);
        expect(parsedModel.length).toBe(nn.layers.length);
    });

    test("setModel should set the model from a string representation", () => {
        const originalModel = nn.getModel();
        const newNN = new SimpleDenseNN([2, 3, 1]);
        newNN.setModel(originalModel);

        expect(newNN.getModel()).toEqual(originalModel);
    });
});
