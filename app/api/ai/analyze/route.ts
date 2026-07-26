import { NextResponse } from 'next/server';
import { generateAssessment } from '@/lib/ai/service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      startupName,
      startupDescription,
      industry,
      businessModel,
      fundingStage,
      teamSize,
      financialInfo,
    } = body || {};

    if (!startupName || !startupDescription || !industry || !businessModel || !fundingStage || !teamSize) {
      return NextResponse.json({ error: 'Parameter input tidak lengkap.' }, { status: 400 });
    }

    const result = await generateAssessment({
      startupName,
      startupDescription,
      industry,
      businessModel,
      fundingStage,
      teamSize,
      financialInfo,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI analyze handler crash:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
