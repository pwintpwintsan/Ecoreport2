import { GoogleGenAI } from "@google/genai";
import { AuditData, AuditCategory, AuditFormData } from "../types";

export const generateAuditInsights = async (
  data: AuditData[],
  category: AuditCategory,
  auditFormData: AuditFormData | null
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const sampleData = data.slice(0, 10); // Send a sample to avoid token limits
  const prompt = `
    You are an expert sustainability auditor specializing in OSE (Operating System Efficiency) compliance. 
    Analyze the following ${category} performance data and the provided building audit information to generate a professional OSE Audit Report.
    
    Building Audit Information:
    ${auditFormData ? JSON.stringify(auditFormData, null, 2) : 'No building information provided.'}
    
    Performance Data Sample:
    ${JSON.stringify(sampleData, null, 2)}
    
    The report MUST follow this professional OSE Audit Report structure:
    
    # OSE AUDIT REPORT
    
    ## 1. EXECUTIVE SUMMARY
    - Brief overview of the building and its sustainability goals.
    - Summary of overall plant and system efficiency.
    - Key performance indicators (KPIs) summary.
    
    ## 2. BUILDING INFORMATION
    - **Building Name:** ${auditFormData?.general.buildingName || 'N/A'}
    - **Address:** ${auditFormData?.general.address || 'N/A'}
    - **Building Type:** ${auditFormData?.general.buildingType || 'N/A'}
    - **Gross Floor Area:** ${auditFormData?.general.grossFloorArea || 'N/A'} m²
    - **Operating Hours:** ${auditFormData?.general.operatingHours || 'N/A'}
    
    ## 3. COOLING PLANT SYSTEM OVERVIEW
    - Description of the chiller plant configuration.
    - Chiller types, capacity, and rated efficiencies.
    - Control strategies and optimization measures currently in place.
    
    ## 4. INSTRUMENTATION & DATA LOGGING
    - Verification of sensor calibration and data logging intervals.
    - Assessment of power meter installations and BMS data reliability.
    
    ## 5. PERFORMANCE DATA ANALYSIS
    - Analysis of average and peak cooling loads.
    - Detailed breakdown of chiller, plant, and system efficiencies (kW/RT).
    - Heat balance verification results.
    
    ## 6. AIR-SIDE SYSTEM & SPACE CONDITIONS
    - Evaluation of air-side efficiency and power consumption.
    - Assessment of indoor space conditions (Temp, Humidity, CO2).
    
    ## 7. COMPLIANCE & BEST PRACTICES
    - Verification against OSE compliance standards.
    - Assessment of CHW ΔT, pump efficiency, and cooling tower approach.
    
    ## 8. FINDINGS & RECOMMENDATIONS
    - **Key Performance Gaps:** Identification of inefficiencies.
    - **Corrective Measures:** Actions already taken or planned.
    - **Energy Saving Opportunities:** Potential improvements with estimated savings.
    
    ## 9. CONCLUSION
    - Final assessment of the building's sustainability performance.
    
    Format the output in clean, professional Markdown with clear headings and bullet points. Use tables where appropriate for data comparison.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating report content. Please check your API configuration.";
  }
};
