package com.nexus.origin.lock.services;

import com.nexus.origin.lock.models.Idea;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CertificateService {

    private static final DateTimeFormatter CERTIFICATE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    static {
        System.setProperty("java.awt.headless", "true");
    }

    public byte[] generate(Idea idea) {
        try {
            JasperReport report = JasperCompileManager.compileReport(
                    new ClassPathResource("reports/certificate_template.jrxml").getInputStream()
            );

            Map<String, Object> fields = Map.of(
                    "ideaTitle", idea.getTitle(),
                    "ownerName", idea.getUser() == null ? "Unknown owner" : idea.getUser().getUsername(),
                    "contentHash", idea.getContentHash(),
                    "txHash", idea.getTxHash() == null ? "Not provided" : idea.getTxHash(),
                    "issuedDate", idea.getCreatedAt() == null ? "" : CERTIFICATE_DATE_FORMAT.format(idea.getCreatedAt()),
                    "verificationStatus", Boolean.TRUE.equals(idea.getBlockchainVerified()) ? "Blockchain verified" : "Pending blockchain verification"
            );

            JasperPrint print = JasperFillManager.fillReport(
                    report,
                    new HashMap<>(),
                    new JRBeanCollectionDataSource(List.of(fields))
            );

            return JasperExportManager.exportReportToPdf(print);
        } catch (JRException | IOException ex) {
            throw new IllegalStateException("Could not generate certificate", ex);
        }
    }
}
