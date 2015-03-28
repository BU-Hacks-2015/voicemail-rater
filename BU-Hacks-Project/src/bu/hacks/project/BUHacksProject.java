/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bu.hacks.project;

import javax.sound.sampled.*;
import java.io.*;

/**
 *
 * @author Naib
 * @author Hung
 * @author Cindy
 * @author Oliver
 * @author Dan
 *
 */
public class BUHacksProject {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws UnsupportedAudioFileException, IOException {
        // TODO code application logic here
        File file = new File("ihaveadream.mp3");
        AudioInputStream in = AudioSystem.getAudioInputStream(file);
        AudioInputStream din = null;
        AudioFormat baseFormat = in.getFormat();
        AudioFormat decodedFormat = new AudioFormat(AudioFormat.Encoding.PCM_SIGNED,
                baseFormat.getSampleRate(),
                16,
                baseFormat.getChannels(),
                baseFormat.getChannels() * 2,
                baseFormat.getSampleRate(),
                false);
        din = AudioSystem.getAudioInputStream(decodedFormat, in);
    }

}
