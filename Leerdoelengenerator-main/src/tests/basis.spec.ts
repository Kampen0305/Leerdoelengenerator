import { resolveBasis, LevelCluster, BasisType } from "@/lib/basis";

test("niveau → basis mapping is hard", () => {
  expect(resolveBasis(LevelCluster.FUNDEREND)).toBe(BasisType.KER);
  expect(resolveBasis(LevelCluster.MBO)).toBe(BasisType.NPL);
  expect(resolveBasis(LevelCluster.HBO)).toBe(BasisType.NPL);
  expect(resolveBasis(LevelCluster.WO)).toBe(BasisType.NPL);
});
