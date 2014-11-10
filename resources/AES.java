// Realtime
// AES Encrypt and Decrypt
// main package, Aes.java

package main;

import java.security.MessageDigest;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

public class Aes {
    private static byte[] iv = "0000000000000000".getBytes();

    private static String decrypt(String encrypted, String seed)
            throws Exception {
        byte[] keyb = seed.getBytes("utf-8");
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] thedigest = md.digest(keyb);
        SecretKeySpec skey = new SecretKeySpec(thedigest, "AES");
        Cipher dcipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        dcipher.init(Cipher.DECRYPT_MODE, skey, new IvParameterSpec(iv));

        byte[] clearbyte = dcipher.doFinal(DatatypeConverter
                .parseHexBinary(encrypted));
        return new String(clearbyte);
    }

    public static String encrypt(String content, String key) throws Exception {
        byte[] input = content.getBytes("utf-8");

        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] thedigest = md.digest(key.getBytes("utf-8"));
        SecretKeySpec skc = new SecretKeySpec(thedigest, "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, skc, new IvParameterSpec(iv));

        byte[] cipherText = new byte[cipher.getOutputSize(input.length)];
        int ctLength = cipher.update(input, 0, input.length, cipherText, 0);
        ctLength += cipher.doFinal(cipherText, ctLength);
        return DatatypeConverter.printHexBinary(cipherText);
    }

    public static void main(String[] args) throws Exception {
        String data = "hello";
        String key = "hi";
        String cipher = Aes.encrypt(data, key);
        String decipher = Aes.decrypt(cipher, key);
        System.out.println(cipher);
        System.out.println(decipher);
    }
}
