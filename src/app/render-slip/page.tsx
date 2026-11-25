import { SlipRenderer } from '../../components/slips/SlipRenderer';
import { SlipData } from '../../types/slip';

export const dynamic = 'force-dynamic';

export default function RenderSlipPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token;
  const expectedToken = process.env.RENDER_SECRET_TOKEN || 'secure_render_84f93a2c';
  
  if (token !== expectedToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF7F7]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-[#F2C2C9] max-w-sm w-full mx-4">
          <div className="w-12 h-12 bg-[#FDF1F3] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#F2C2C9]">
            <span className="text-[#84142D] font-black text-xl">!</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#1E1B1C] mb-2 tracking-tight">Access Denied</h1>
          <p className="text-[#786D70] text-[13px] leading-relaxed">
            Direct access to template source code is strictly prohibited. Your IP has been logged.
          </p>
        </div>
      </div>
    );
  }

  const dataParam = searchParams.data;
  if (!dataParam || typeof dataParam !== 'string') {
    return <div className="p-10 text-[#84142D] font-bold">No slip data provided</div>;
  }

  try {
    const slipData: SlipData = JSON.parse(Buffer.from(dataParam, 'base64').toString('utf-8'));
    
    return (
      <div className="bg-transparent flex items-start justify-center min-h-screen p-4">
        <div id="slip-render-container" className="inline-block">
          <SlipRenderer data={slipData} />
        </div>
      </div>
    );
  } catch (err) {
    return <div className="p-10 text-[#84142D] font-bold">Invalid slip data payload</div>;
  }
}
