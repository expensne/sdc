import { Matrix } from "@/math/matrix";

describe("Matrix", () => {
    test("constructor initializes matrix correctly", () => {
        const m = new Matrix(2, 3);
        expect(m.rows).toBe(2);
        expect(m.cols).toBe(3);
        expect(m.data).toEqual([
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });

    test("add method adds correctly", () => {
        const m1 = new Matrix(2, 2).map(() => 1);
        const m2 = new Matrix(2, 2).map(() => 2);
        const result = m1.add(m2);
        expect(result.data).toEqual([
            [3, 3],
            [3, 3],
        ]);
    });

    test("subtract method subtracts correctly", () => {
        const m1 = new Matrix(2, 2).map(() => 3);
        const m2 = new Matrix(2, 2).map(() => 2);
        const result = m1.subtract(m2);
        expect(result.data).toEqual([
            [1, 1],
            [1, 1],
        ]);
    });

    test("serialize method serializes correctly", () => {
        let i = 1;
        const m = new Matrix(2, 3).map(() => i++);
        expect(m.serialize()).toEqual('{"rows":2,"cols":3,"data":[[1,2,3],[4,5,6]],"shape":[2,3]}');
    });

    test("deserialize method deserializes correctly", () => {
        const m = Matrix.deserialize('{"rows":2,"cols":3,"data":[[1,2,3],[4,5,6]],"shape":[2,3]}');
        expect(m.data).toEqual([
            [1, 2, 3],
            [4, 5, 6],
        ]);
    });
});
