import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Trip } from '../../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  /**
   * Generates and downloads an ultra-detailed, professional PDF travel itinerary for a Trip.
   */
  exportTripToPdf(trip: Trip): boolean {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 14;

      const checkPageBreak = (neededHeight: number): boolean => {
        if (y + neededHeight > pageHeight - 20) {
          doc.addPage();
          y = 16;
          return true;
        }
        return false;
      };

      // ========================================================
      // 1. BRAND HEADER & OFFICIAL DOSSIER BANNER
      // ========================================================
      doc.setFillColor(30, 27, 75); // Deep Indigo (#1e1b4b)
      doc.roundedRect(margin, y, contentWidth, 26, 2.5, 2.5, 'F');

      // Accent stripe on left
      doc.setFillColor(99, 102, 241); // Accent Indigo
      doc.rect(margin, y, 4, 26, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('ROUTEVEDA • ADVENTURE TRAVEL DOSSIER', margin + 8, y + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text('Official Verified Itinerary & Smart Adventure Companion', margin + 8, y + 15);
      doc.text(`Booking Ref: #${trip.id || 'TF-PLAN-' + Date.now()}`, margin + 8, y + 21);

      const issueDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.text(`STATUS: ${(trip.status || 'Planning').toUpperCase()}`, pageWidth - margin - 8, y + 9, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(203, 213, 225);
      doc.text(`Issue Date: ${issueDate}`, pageWidth - margin - 8, y + 15, { align: 'right' });
      doc.text(`Traveler: ${trip.travelerName || 'Lead Explorer'}`, pageWidth - margin - 8, y + 21, { align: 'right' });

      y += 32;

      // ========================================================
      // 2. TRIP OVERVIEW & ROUTE CARD
      // ========================================================
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(trip.name || 'Custom India Adventure Tour', margin, y);
      y += 5.5;

      const dests = trip.destinationNames && trip.destinationNames.length > 0
        ? trip.destinationNames.join('   ➔   ')
        : 'India Exploration';

      doc.setTextColor(79, 70, 229);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`Trip Route: ${dests}`, margin, y);
      y += 7;

      // Overview 4-Column Metric Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 21, 2, 2, 'FD');

      const colW = contentWidth / 4;

      // Col 1: Dates
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('TRAVEL DATES', margin + 5, y + 7);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`${trip.startDate || 'Flexible'} to ${trip.endDate || 'Flexible'}`, margin + 5, y + 15);

      // Col 2: Duration & Travelers
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('DURATION & TRAVELERS', margin + colW + 5, y + 7);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`${trip.duration || 1} Days • ${trip.numberOfTravelers || 1} Traveler(s)`, margin + colW + 5, y + 15);

      // Col 3: Travel Style
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('TRAVEL STYLE', margin + colW * 2 + 5, y + 7);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`${trip.travelStyle || 'Adventure'}`, margin + colW * 2 + 5, y + 15);

      // Col 4: Total Budget
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('ESTIMATED BUDGET', margin + colW * 3 + 5, y + 7);
      doc.setTextColor(16, 185, 129); // Green
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      const totalCost = trip.estimatedCost || trip.budget || 20000;
      doc.text(`₹${totalCost.toLocaleString('en-IN')}`, margin + colW * 3 + 5, y + 15);

      y += 27;

      // ========================================================
      // 3. ITEMIZED BUDGET BREAKDOWN TABLE
      // ========================================================
      checkPageBreak(38);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('1. Financial Budget & Cost Allocation', margin, y);
      y += 5;

      const breakdown = trip.budgetBreakdown || {
        accommodation: Math.round(totalCost * 0.45),
        food: Math.round(totalCost * 0.25),
        transportation: Math.round(totalCost * 0.15),
        activities: Math.round(totalCost * 0.10),
        miscellaneous: Math.round(totalCost * 0.05),
      };

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, y, contentWidth, 6.5, 'FD');

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('EXPENSE CATEGORY', margin + 4, y + 4.5);
      doc.text('DESCRIPTION / SCOPE', margin + 55, y + 4.5);
      doc.text('ALLOCATION', pageWidth - margin - 4, y + 4.5, { align: 'right' });
      y += 6.5;

      const budgetRows = [
        { cat: 'Accommodation & Stays', desc: 'Hotels, resorts, premium adventure eco-lodges', amount: breakdown.accommodation },
        { cat: 'Food & Culinary Trails', desc: 'Regional dining, daily meals, local tasting tours', amount: breakdown.food },
        { cat: 'Transit & Local Travel', desc: 'Transfers, private cabs, inter-city transport', amount: breakdown.transportation },
        { cat: 'Activities & Permits', desc: 'Sightseeing entries, guided treks, adventure sports', amount: breakdown.activities },
        { cat: 'Contingency & Reserve', desc: 'Emergency buffer, shopping, miscellaneous expenses', amount: breakdown.miscellaneous },
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);

      for (const row of budgetRows) {
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, y, contentWidth, 5.5, 'FD');
        doc.setTextColor(30, 41, 59);
        doc.text(row.cat, margin + 4, y + 4);
        doc.setTextColor(100, 116, 139);
        doc.text(row.desc, margin + 55, y + 4);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(`₹${(row.amount || 0).toLocaleString('en-IN')}`, pageWidth - margin - 4, y + 4, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        y += 5.5;
      }

      // Total Row
      doc.setFillColor(238, 242, 255);
      doc.rect(margin, y, contentWidth, 6.5, 'FD');
      doc.setTextColor(67, 56, 202);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL ESTIMATED TRIP COST', margin + 4, y + 4.5);
      doc.text(`₹${totalCost.toLocaleString('en-IN')}`, pageWidth - margin - 4, y + 4.5, { align: 'right' });
      y += 12;

      // ========================================================
      // 4. DAY-BY-DAY COMPREHENSIVE ITINERARY
      // ========================================================
      checkPageBreak(25);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('2. Comprehensive Day-by-Day Travel Schedule', margin, y);
      y += 6;

      if (trip.itinerary && trip.itinerary.length > 0) {
        for (const day of trip.itinerary) {
          const descLines = doc.splitTextToSize(day.description || 'Sightseeing and curated adventure experiences.', contentWidth - 28);
          const hasActivities = day.activities && day.activities.length > 0;
          const hasStay = !!day.accommodation;

          const boxHeight = 22 + descLines.length * 4.2 + (hasActivities ? 5.5 : 0) + (hasStay ? 5.5 : 0);
          checkPageBreak(boxHeight + 4);

          // Day Card Border & Background
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

          // Left Color Accent Bar
          doc.setFillColor(79, 70, 229);
          doc.rect(margin, y, 2.5, boxHeight, 'F');

          // Day Badge
          doc.setFillColor(79, 70, 229);
          doc.roundedRect(margin + 6, y + 4, 18, 5.5, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.text(`DAY ${day.day}`, margin + 15, y + 8, { align: 'center' });

          // Day Title
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.text(day.title || `Day ${day.day} Exploration`, margin + 27, y + 8);

          // Day Timeline / Overview
          let lineY = y + 15;
          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          for (const line of descLines) {
            doc.text(line, margin + 6, lineY);
            lineY += 4.2;
          }

          // Activities Tag
          if (hasActivities) {
            doc.setTextColor(79, 70, 229);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.text(`★ Key Highlights & Activities: ${day.activities.join(' • ')}`, margin + 6, lineY + 2);
            lineY += 5.5;
          }

          // Accommodation Tag
          if (hasStay) {
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7.5);
            doc.text(`🏨 Recommended Overnight Stay: ${day.accommodation}`, margin + 6, lineY + 2);
            lineY += 5.5;
          }

          y += boxHeight + 4;
        }
      }

      // ========================================================
      // 5. PACKING CHECKLIST & ESSENTIALS
      // ========================================================
      checkPageBreak(40);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('3. Smart Travel Checklist & Packing Essentials', margin, y);
      y += 5;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

      const col3W = contentWidth / 3;

      // Col 1: Documents
      doc.setTextColor(79, 70, 229);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('📄 ESSENTIAL DOCUMENTS', margin + 4, y + 5);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('• Government ID (Aadhaar / Passport)', margin + 4, y + 10);
      doc.text('• Hotel bookings & permit printouts', margin + 4, y + 15);
      doc.text('• Digital copies saved offline', margin + 4, y + 20);
      doc.text('• Emergency contact card in wallet', margin + 4, y + 25);

      // Col 2: Gear & Clothing
      doc.setTextColor(79, 70, 229);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('🎒 APPAREL & GEAR', margin + col3W + 4, y + 5);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('• Breathable layered clothing', margin + col3W + 4, y + 10);
      doc.text('• Sturdy hiking / walking shoes', margin + col3W + 4, y + 15);
      doc.text('• Rain poncho / UV sunscreen & hat', margin + col3W + 4, y + 20);
      doc.text('• Reusable water bottle & daypack', margin + col3W + 4, y + 25);

      // Col 3: Health & Electronics
      doc.setTextColor(79, 70, 229);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('💊 HEALTH & ELECTRONICS', margin + col3W * 2 + 4, y + 5);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('• Personal first-aid & ORS sachets', margin + col3W * 2 + 4, y + 10);
      doc.text('• Power bank (10,000+ mAh)', margin + col3W * 2 + 4, y + 15);
      doc.text('• Universal travel adapter', margin + col3W * 2 + 4, y + 20);
      doc.text('• Downloaded offline maps (GPS)', margin + col3W * 2 + 4, y + 25);

      y += 34;

      // ========================================================
      // 6. EMERGENCY GUIDELINES & HELPLINES
      // ========================================================
      checkPageBreak(25);
      doc.setFillColor(254, 242, 242); // Soft Red/Alert Tint
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');

      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('⚠️ 24x7 NATIONAL EMERGENCY & TOURIST HELPLINES (INDIA):', margin + 5, y + 5);

      doc.setTextColor(69, 10, 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('National Emergency: 112   |   Police: 100   |   Ambulance: 108   |   Incredible India Tourist Helpline: 1363 (Toll Free)', margin + 5, y + 11);

      y += 22;

      // Notes section (if present)
      if (trip.notes) {
        checkPageBreak(22);
        doc.setFillColor(254, 243, 199); // Amber tint
        doc.setDrawColor(251, 191, 36);
        doc.roundedRect(margin, y, contentWidth, 15, 2, 2, 'FD');

        doc.setTextColor(146, 64, 14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('Custom Trip Notes / Special Requests:', margin + 5, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(trip.notes, margin + 5, y + 10);
        y += 18;
      }

      // ========================================================
      // 7. FOOTER ON EVERY PAGE
      // ========================================================
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text('RouteVeda • Smart Adventure Travel Planner • www.routeveda.in', margin, pageHeight - 6);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
      }

      // ========================================================
      // 8. TRIGGER BROWSER FILE DOWNLOAD
      // ========================================================
      const sanitizedName = (trip.name || 'RouteVeda_Trip')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_');
      const filename = `${sanitizedName}_Itinerary.pdf`;

      doc.save(filename);
      return true;
    } catch (err) {
      console.error('Error generating PDF with jsPDF:', err);
      return false;
    }
  }
}
