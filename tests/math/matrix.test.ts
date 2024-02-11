import { Matrix } from "@/math/matrix";

describe("Matrix", () => {
    let matrix1: Matrix;
    let matrix2: Matrix;
    let vector: Matrix;

    beforeEach(() => {
        matrix1 = Matrix.fromArray2D([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
        matrix2 = Matrix.fromArray2D([
            [9, 10, 11, 12],
            [13, 14, 15, 16],
        ]);
        vector = Matrix.fromArray1D([1, 2, 3, 4]);
    });

    test("constructor should initialize a matrix with the correct number of rows and columns", () => {
        const m = new Matrix(2, 3);

        expect(m.rows).toBe(2);
        expect(m.cols).toBe(3);
        expect(m.data).toEqual([
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });

    test("fromArray2D should return a matrix with the correct data", () => {
        const arr = [
            [1, 2, 3],
            [4, 5, 6],
        ];
        const m = Matrix.fromArray2D(arr);

        expect(m.data).toEqual(arr);
    });

    test("fromArray1D should return a matrix with the correct data", () => {
        const arr = [1, 2, 3];
        const m = Matrix.fromArray1D(arr);

        expect(m.data).toEqual([[1], [2], [3]]);
    });

    test("randomize should fill the matrix with the return value of the provided function", () => {
        const m = new Matrix(2, 2).randomize(() => 4711);

        expect(m.data).toEqual([
            [4711, 4711],
            [4711, 4711],
        ]);
    });

    test("copy should return a new matrix with the same data", () => {
        const copy = matrix1.copy();
        matrix1.data[0][0] = 4711; // change the original matrix

        expect(copy.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
        // the copy should not be affected
        expect(matrix1.data).toEqual([
            [4711, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test("add should return a new matrix that is the result of adding two matrices together", () => {
        const result = Matrix.add(matrix1, matrix2);

        expect(result.data).toEqual([
            [10, 12, 14, 16],
            [18, 20, 22, 24],
        ]);
        // the original matrices should not be affected
        expect(matrix1.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
        expect(matrix2.data).toEqual([
            [9, 10, 11, 12],
            [13, 14, 15, 16],
        ]);
    });

    test("subtract should return a new matrix that is the result of subtracting one matrix from another", () => {
        const result = Matrix.subtract(matrix1, matrix2);

        expect(result.data).toEqual([
            [-8, -8, -8, -8],
            [-8, -8, -8, -8],
        ]);
        // the original matrices should not be affected
        expect(matrix1.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
        expect(matrix2.data).toEqual([
            [9, 10, 11, 12],
            [13, 14, 15, 16],
        ]);
    });

    test("multiply should return a new matrix that is the result of element-wise multiplication of two matrices", () => {
        const result = Matrix.multiply(matrix1, matrix2);

        expect(result.data).toEqual([
            [9, 20, 33, 48],
            [65, 84, 105, 128],
        ]);
        // the original matrices should not be affected
        expect(matrix1.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
        expect(matrix2.data).toEqual([
            [9, 10, 11, 12],
            [13, 14, 15, 16],
        ]);
    });

    test("dot should return a new matrix that is the result of matrix multiplication of two matrices", () => {
        const result = Matrix.dot(matrix1, matrix2.transposed());

        expect(result.data).toEqual([
            [110, 150],
            [278, 382],
        ]);

        // the original matrices should not be affected
        expect(matrix1.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
        expect(matrix2.data).toEqual([
            [9, 10, 11, 12],
            [13, 14, 15, 16],
        ]);
    });

    test("sum should return the sum of all elements in the matrix", () => {
        const result = Matrix.sum(matrix1);

        expect(result).toBe(36);
        // the original matrix should not be affected
        expect(matrix1.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test("summed should return the sum of all elements in the matrix", () => {
        const result = matrix1.summed();

        expect(result).toBe(36);
        // the original matrix should not be affected
        expect(matrix1.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test("transpose should return a new matrix that is the transposed version of the original matrix", () => {
        const result = Matrix.transpose(matrix1);
        matrix1.data[0][0] = 4711; // change the original matrix

        expect(result.data).toEqual([
            [1, 5],
            [2, 6],
            [3, 7],
            [4, 8],
        ]);
        // the original matrix should not be affected
        expect(matrix1.data).toEqual([
            [4711, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test("transposed should return a new matrix that is the transposed version of the original matrix", () => {
        const result = matrix1.transposed();
        matrix1.data[0][0] = 4711; // change the original matrix

        expect(result.data).toEqual([
            [1, 5],
            [2, 6],
            [3, 7],
            [4, 8],
        ]);
        // the original matrix should not be affected
        expect(matrix1.data).toEqual([
            [4711, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test("serialize should return a string representation of the matrix", () => {
        const result = matrix1.serialize();

        expect(result).toBe('{"rows":2,"cols":4,"data":[[1,2,3,4],[5,6,7,8]],"shape":[2,4]}');
        // the original matrix should not be affected
        expect(matrix1.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test("deserialize should return a matrix that is created from a string representation", () => {
        const serialized = '{"rows":2,"cols":4,"data":[[1,2,3,4],[5,6,7,8]],"shape":[2,4]}';
        const m = Matrix.deserialize(serialized);

        expect(m.data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test("map should return a new matrix that is the result of applying a function to each element of the original matrix", () => {
        const result = matrix1.map((e) => e * 2);

        expect(result.data).toEqual([
            [2, 4, 6, 8],
            [10, 12, 14, 16],
        ]);
    });

    test("forEach should apply a function to each element of the matrix", () => {
        const result: number[] = [];
        matrix1.forEach((e) => result.push(e * 2));

        expect(result).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
    });

    test("toArray2D should return a 2D array representation of the matrix", () => {
        const result = matrix1.toArray2D();

        expect(result).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test("toArray1D should return a 1D array representation of the matrix", () => {
        const result = vector.toArray1D();

        expect(result).toEqual([1, 2, 3, 4]);
        // the original matrix should not be affected
        expect(vector.data).toEqual([[1], [2], [3], [4]]);
    });

    test("toArray1D should throw an error if the matrix has more than one column", () => {
        expect(() => matrix1.toArray1D()).toThrow(
            "Matrix must have 1 column to convert to 1D array"
        );
    });
});
