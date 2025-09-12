import { generate } from '@/server/generate';

test.each(['PO','SO','VSO','MBO','HBO','WO'])(
  'output start met juiste niveau %s',
  async (level) => {
    const res = await generate({ level, topic: 'digitale geletterdheid' });
    expect(res.text.startsWith(`Niveau: ${level}`)).toBe(true);
  }
);
